[**@zip.js/zip.js**](../README.md)

***

[@zip.js/zip.js](../globals.md) / URLString

# Interface: URLString

Defined in: [index.d.ts:558](https://github.com/gildas-lormeau/zip.js/blob/ac43341b8867abfc96920b30361a638957ffd437/index.d.ts#L558)

Represents a URL stored into a `string`.

## Extends

- `String`

## Indexable

\[`index`: `number`\]: `string`

## Properties

### length

> `readonly` **length**: `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:517

Returns the length of a String object.

#### Inherited from

`String.length`

## Methods

### \[iterator\]()

> **\[iterator\]**(): `StringIterator`\<`string`\>

Defined in: node\_modules/typescript/lib/lib.es2015.iterable.d.ts:272

Iterator

#### Returns

`StringIterator`\<`string`\>

#### Inherited from

`String.[iterator]`

***

### ~~anchor()~~

> **anchor**(`name`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:463

Returns an `<a>` HTML anchor element and sets the name attribute to the text value

#### Parameters

##### name

`string`

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.anchor`

***

### ~~big()~~

> **big**(): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:469

Returns a `<big>` HTML element

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.big`

***

### ~~blink()~~

> **blink**(): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:475

Returns a `<blink>` HTML element

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.blink`

***

### ~~bold()~~

> **bold**(): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:481

Returns a `<b>` HTML element

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.bold`

***

### charAt()

> **charAt**(`pos`): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:418

Returns the character at the specified index.

#### Parameters

##### pos

`number`

The zero-based index of the desired character.

#### Returns

`string`

#### Inherited from

`String.charAt`

***

### charCodeAt()

> **charCodeAt**(`index`): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:424

Returns the Unicode value of the character at the specified location.

#### Parameters

##### index

`number`

The zero-based index of the desired character. If there is no character at the specified index, NaN is returned.

#### Returns

`number`

#### Inherited from

`String.charCodeAt`

***

### codePointAt()

> **codePointAt**(`pos`): `undefined` \| `number`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:410

Returns a nonnegative integer Number less than 1114112 (0x110000) that is the code point
value of the UTF-16 encoded code point starting at the string element at position pos in
the String resulting from converting this object to a String.
If there is no element at that position, the result is undefined.
If a valid UTF-16 surrogate pair does not begin at pos, the result is the code unit at pos.

#### Parameters

##### pos

`number`

#### Returns

`undefined` \| `number`

#### Inherited from

`String.codePointAt`

***

### concat()

> **concat**(...`strings`): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:430

Returns a string that contains the concatenation of two or more strings.

#### Parameters

##### strings

...`string`[]

The strings to append to the end of the string.

#### Returns

`string`

#### Inherited from

`String.concat`

***

### endsWith()

> **endsWith**(`searchString`, `endPosition?`): `boolean`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:426

Returns true if the sequence of elements of searchString converted to a String is the
same as the corresponding elements of this object (converted to a String) starting at
endPosition – length(this). Otherwise returns false.

#### Parameters

##### searchString

`string`

##### endPosition?

`number`

#### Returns

`boolean`

#### Inherited from

`String.endsWith`

***

### ~~fixed()~~

> **fixed**(): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:487

Returns a `<tt>` HTML element

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.fixed`

***

### ~~fontcolor()~~

> **fontcolor**(`color`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:493

Returns a `<font>` HTML element and sets the color attribute value

#### Parameters

##### color

`string`

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.fontcolor`

***

### ~~fontsize()~~

#### Call Signature

> **fontsize**(`size`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:499

Returns a `<font>` HTML element and sets the size attribute value

##### Parameters

###### size

`number`

##### Returns

`string`

##### Deprecated

A legacy feature for browser compatibility

##### Inherited from

`String.fontsize`

#### Call Signature

> **fontsize**(`size`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:505

Returns a `<font>` HTML element and sets the size attribute value

##### Parameters

###### size

`string`

##### Returns

`string`

##### Deprecated

A legacy feature for browser compatibility

##### Inherited from

`String.fontsize`

***

### includes()

> **includes**(`searchString`, `position?`): `boolean`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:419

Returns true if searchString appears as a substring of the result of converting this
object to a String, at one or more positions that are
greater than or equal to position; otherwise, returns false.

#### Parameters

##### searchString

`string`

search string

##### position?

`number`

If position is undefined, 0 is assumed, so as to search all of the String.

#### Returns

`boolean`

#### Inherited from

`String.includes`

***

### indexOf()

> **indexOf**(`searchString`, `position?`): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:437

Returns the position of the first occurrence of a substring.

#### Parameters

##### searchString

`string`

The substring to search for in the string

##### position?

`number`

The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.

#### Returns

`number`

#### Inherited from

`String.indexOf`

***

### ~~italics()~~

> **italics**(): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:511

Returns an `<i>` HTML element

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.italics`

***

### lastIndexOf()

> **lastIndexOf**(`searchString`, `position?`): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:444

Returns the last occurrence of a substring in the string.

#### Parameters

##### searchString

`string`

The substring to search for.

##### position?

`number`

The index at which to begin searching. If omitted, the search begins at the end of the string.

#### Returns

`number`

#### Inherited from

`String.lastIndexOf`

***

### ~~link()~~

> **link**(`url`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:517

Returns an `<a>` HTML element and sets the href attribute value

#### Parameters

##### url

`string`

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.link`

***

### localeCompare()

#### Call Signature

> **localeCompare**(`that`): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:450

Determines whether two strings are equivalent in the current locale.

##### Parameters

###### that

`string`

String to compare to target string

##### Returns

`number`

##### Inherited from

`String.localeCompare`

#### Call Signature

> **localeCompare**(`that`, `locales?`, `options?`): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:4562

Determines whether two strings are equivalent in the current or specified locale.

##### Parameters

###### that

`string`

String to compare to target string

###### locales?

A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. This parameter must conform to BCP 47 standards; see the Intl.Collator object for details.

`string` | `string`[]

###### options?

`CollatorOptions`

An object that contains one or more properties that specify comparison options. see the Intl.Collator object for details.

##### Returns

`number`

##### Inherited from

`String.localeCompare`

***

### match()

#### Call Signature

> **match**(`regexp`): `null` \| `RegExpMatchArray`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:456

Matches a string with a regular expression, and returns an array containing the results of that search.

##### Parameters

###### regexp

A variable name or string literal containing the regular expression pattern and flags.

`string` | `RegExp`

##### Returns

`null` \| `RegExpMatchArray`

##### Inherited from

`String.match`

#### Call Signature

> **match**(`matcher`): `null` \| `RegExpMatchArray`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:241

Matches a string or an object that supports being matched against, and returns an array
containing the results of that search, or null if no matches are found.

##### Parameters

###### matcher

An object that supports being matched against.

###### [match]

##### Returns

`null` \| `RegExpMatchArray`

##### Inherited from

`String.match`

***

### normalize()

#### Call Signature

> **normalize**(`form`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:434

Returns the String value result of normalizing the string into the normalization form
named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.

##### Parameters

###### form

Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default
is "NFC"

`"NFC"` | `"NFD"` | `"NFKC"` | `"NFKD"`

##### Returns

`string`

##### Inherited from

`String.normalize`

#### Call Signature

> **normalize**(`form?`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:442

Returns the String value result of normalizing the string into the normalization form
named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.

##### Parameters

###### form?

`string`

Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default
is "NFC"

##### Returns

`string`

##### Inherited from

`String.normalize`

***

### padEnd()

> **padEnd**(`maxLength`, `fillString?`): `string`

Defined in: node\_modules/typescript/lib/lib.es2017.string.d.ts:44

Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
The padding is applied from the end (right) of the current string.

#### Parameters

##### maxLength

`number`

The length of the resulting string once the current string has been padded.
       If this parameter is smaller than the current string's length, the current string will be returned as it is.

##### fillString?

`string`

The string to pad the current string with.
       If this string is too long, it will be truncated and the left-most part will be applied.
       The default value for this parameter is " " (U+0020).

#### Returns

`string`

#### Inherited from

`String.padEnd`

***

### padStart()

> **padStart**(`maxLength`, `fillString?`): `string`

Defined in: node\_modules/typescript/lib/lib.es2017.string.d.ts:31

Pads the current string with a given string (possibly repeated) so that the resulting string reaches a given length.
The padding is applied from the start (left) of the current string.

#### Parameters

##### maxLength

`number`

The length of the resulting string once the current string has been padded.
       If this parameter is smaller than the current string's length, the current string will be returned as it is.

##### fillString?

`string`

The string to pad the current string with.
       If this string is too long, it will be truncated and the left-most part will be applied.
       The default value for this parameter is " " (U+0020).

#### Returns

`string`

#### Inherited from

`String.padStart`

***

### repeat()

> **repeat**(`count`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:449

Returns a String value that is made from count copies appended together. If count is 0,
the empty string is returned.

#### Parameters

##### count

`number`

number of copies to append

#### Returns

`string`

#### Inherited from

`String.repeat`

***

### replace()

#### Call Signature

> **replace**(`searchValue`, `replaceValue`): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:463

Replaces text in a string, using a regular expression or search string.

##### Parameters

###### searchValue

A string or regular expression to search for.

`string` | `RegExp`

###### replaceValue

`string`

A string containing the text to replace. When the [`searchValue`](#replace-1) is a `RegExp`, all matches are replaced if the `g` flag is set (or only those matches at the beginning, if the `y` flag is also present). Otherwise, only the first match of [`searchValue`](#replace-1) is replaced.

##### Returns

`string`

##### Inherited from

`String.replace`

#### Call Signature

> **replace**(`searchValue`, `replacer`): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:470

Replaces text in a string, using a regular expression or search string.

##### Parameters

###### searchValue

A string to search for.

`string` | `RegExp`

###### replacer

(`substring`, ...`args`) => `string`

A function that returns the replacement text.

##### Returns

`string`

##### Inherited from

`String.replace`

#### Call Signature

> **replace**(`searchValue`, `replaceValue`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:248

Passes a string and [`replaceValue`](#replace-3) to the `[Symbol.replace]` method on [`searchValue`](#replace-3). This method is expected to implement its own replacement algorithm.

##### Parameters

###### searchValue

An object that supports searching for and replacing matches within a string.

###### [replace]

###### replaceValue

`string`

The replacement text.

##### Returns

`string`

##### Inherited from

`String.replace`

#### Call Signature

> **replace**(`searchValue`, `replacer`): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:255

Replaces text in a string, using an object that supports replacement within a string.

##### Parameters

###### searchValue

A object can search for and replace matches within a string.

###### [replace]

###### replacer

(`substring`, ...`args`) => `string`

A function that returns the replacement text.

##### Returns

`string`

##### Inherited from

`String.replace`

***

### search()

#### Call Signature

> **search**(`regexp`): `number`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:476

Finds the first substring match in a regular expression search.

##### Parameters

###### regexp

The regular expression pattern and applicable flags.

`string` | `RegExp`

##### Returns

`number`

##### Inherited from

`String.search`

#### Call Signature

> **search**(`searcher`): `number`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:261

Finds the first substring match in a regular expression search.

##### Parameters

###### searcher

An object which supports searching within a string.

###### [search]

##### Returns

`number`

##### Inherited from

`String.search`

***

### slice()

> **slice**(`start?`, `end?`): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:484

Returns a section of a string.

#### Parameters

##### start?

`number`

The index to the beginning of the specified portion of stringObj.

##### end?

`number`

The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end.
If this value is not specified, the substring continues to the end of stringObj.

#### Returns

`string`

#### Inherited from

`String.slice`

***

### ~~small()~~

> **small**(): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:523

Returns a `<small>` HTML element

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.small`

***

### split()

#### Call Signature

> **split**(`separator`, `limit?`): `string`[]

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:491

Split a string into substrings using the specified separator and return them as an array.

##### Parameters

###### separator

A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.

`string` | `RegExp`

###### limit?

`number`

A value used to limit the number of elements returned in the array.

##### Returns

`string`[]

##### Inherited from

`String.split`

#### Call Signature

> **split**(`splitter`, `limit?`): `string`[]

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:268

Split a string into substrings using the specified separator and return them as an array.

##### Parameters

###### splitter

An object that can split a string.

###### [split]

###### limit?

`number`

A value used to limit the number of elements returned in the array.

##### Returns

`string`[]

##### Inherited from

`String.split`

***

### startsWith()

> **startsWith**(`searchString`, `position?`): `boolean`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:456

Returns true if the sequence of elements of searchString converted to a String is the
same as the corresponding elements of this object (converted to a String) starting at
position. Otherwise returns false.

#### Parameters

##### searchString

`string`

##### position?

`number`

#### Returns

`boolean`

#### Inherited from

`String.startsWith`

***

### ~~strike()~~

> **strike**(): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:529

Returns a `<strike>` HTML element

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.strike`

***

### ~~sub()~~

> **sub**(): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:535

Returns a `<sub>` HTML element

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.sub`

***

### ~~substr()~~

> **substr**(`from`, `length?`): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:526

Gets a substring beginning at the specified location and having the specified length.

#### Parameters

##### from

`number`

The starting position of the desired substring. The index of the first character in the string is zero.

##### length?

`number`

The number of characters to include in the returned substring.

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.substr`

***

### substring()

> **substring**(`start`, `end?`): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:499

Returns the substring at the specified location within a String object.

#### Parameters

##### start

`number`

The zero-based index number indicating the beginning of the substring.

##### end?

`number`

Zero-based index number indicating the end of the substring. The substring includes the characters up to, but not including, the character indicated by end.
If end is omitted, the characters from start through the end of the original string are returned.

#### Returns

`string`

#### Inherited from

`String.substring`

***

### ~~sup()~~

> **sup**(): `string`

Defined in: node\_modules/typescript/lib/lib.es2015.core.d.ts:541

Returns a `<sup>` HTML element

#### Returns

`string`

#### Deprecated

A legacy feature for browser compatibility

#### Inherited from

`String.sup`

***

### toLocaleLowerCase()

> **toLocaleLowerCase**(`locales?`): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:505

Converts all alphabetic characters to lowercase, taking into account the host environment's current locale.

#### Parameters

##### locales?

`string` | `string`[]

#### Returns

`string`

#### Inherited from

`String.toLocaleLowerCase`

***

### toLocaleUpperCase()

> **toLocaleUpperCase**(`locales?`): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:511

Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale.

#### Parameters

##### locales?

`string` | `string`[]

#### Returns

`string`

#### Inherited from

`String.toLocaleUpperCase`

***

### toLowerCase()

> **toLowerCase**(): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:502

Converts all the alphabetic characters in a string to lowercase.

#### Returns

`string`

#### Inherited from

`String.toLowerCase`

***

### toString()

> **toString**(): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:412

Returns a string representation of a string.

#### Returns

`string`

#### Inherited from

`String.toString`

***

### toUpperCase()

> **toUpperCase**(): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:508

Converts all the alphabetic characters in a string to uppercase.

#### Returns

`string`

#### Inherited from

`String.toUpperCase`

***

### trim()

> **trim**(): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:514

Removes the leading and trailing white space and line terminator characters from a string.

#### Returns

`string`

#### Inherited from

`String.trim`

***

### valueOf()

> **valueOf**(): `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:529

Returns the primitive value of the specified object.

#### Returns

`string`

#### Inherited from

`String.valueOf`
