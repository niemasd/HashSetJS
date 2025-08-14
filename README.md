# HashSetJS
Niema's Hash Set implementation in JavaScript

## Example

```javascript
console.log("Creating new Hash Set...");
const hs = new HashSet();
const words = ['Alexander', 'Niema', 'Moshiri', 'Niema'];
console.log("Adding elements: " + words.join(' '));
for(const word of words) {
    hs.add(word);
}
console.log(hs);
const has_check = 'Alexander';
console.log(`Checking if Hash Set has: ${has_check}`);
console.log(hs.has(has_check));
console.log(`Deleting and re-checking: ${has_check}`);
hs.delete(has_check);
console.log(hs);
console.log(hs.has(has_check));
console.log("Creating copy from JSON and checking equality...");
json = hs.toJSON();
hs2 = HashSet.fromJSON(json);
console.log(hs.equals(hs2));
console.log("Creating copy from file and checking equality...");
const fn = 'hashset.hsj';
hs.dump(fn)
hs3 = HashSet.load(fn);
console.log(hs.equals(hs3));
```
