#!/bin/sh
# Creates the GitHub release for the version declared in package.json, which triggers the publish
# workflow. It only encodes the checks a release must pass anyway: the released commit is the pushed
# master head, its tests concluded green (the publish gate would otherwise fail after the release
# exists, and recovering means deleting the release and the tag), and the tag targets the branch
# because the API rejects abbreviated commit SHAs as a target.
set -e

notes_file=$1
if [ -z "$notes_file" ]; then
	echo "usage: npm run release -- <notes-file>" >&2
	exit 1
fi
if [ ! -f "$notes_file" ]; then
	echo "notes file not found: $notes_file" >&2
	exit 1
fi
version=$(node -p "require('./package.json').version")
tag="v$version"
if gh release view "$tag" >/dev/null 2>&1; then
	echo "release $tag already exists" >&2
	exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
	echo "the working tree is not clean" >&2
	exit 1
fi
git fetch origin master
sha=$(git rev-parse HEAD)
if [ "$sha" != "$(git rev-parse origin/master)" ]; then
	echo "HEAD is not origin/master, push the bump commit first" >&2
	exit 1
fi
run=$(gh api "repos/{owner}/{repo}/actions/workflows/test.yml/runs?head_sha=$sha&per_page=1" \
	--jq 'if (.workflow_runs | length) == 0 then "none none none" else (.workflow_runs[0] | "\(.status) \(.conclusion) \(.html_url)") end')
run_status=$(echo "$run" | cut -d " " -f 1)
conclusion=$(echo "$run" | cut -d " " -f 2)
url=$(echo "$run" | cut -d " " -f 3)
if [ "$run_status" = "none" ]; then
	echo "no test run found for $sha yet, wait for it and run this again" >&2
	exit 1
fi
if [ "$run_status" != "completed" ] || [ "$conclusion" != "success" ]; then
	echo "the tests of $sha concluded $run_status/$conclusion, only a green commit can be released: $url" >&2
	exit 1
fi
gh release create "$tag" --target master --notes-file "$notes_file"
