// imports
const crypto = require('crypto');
const fs = require('fs');

// useful constants
const HASHSETJS_VERSION = '0.0.1';

// hash functions
const HASH_FUNCTIONS = new Map();
HASH_FUNCTIONS.set('sha512_str',
    /**
     * Wrapper to compute SHA512 on a `String`.
     * @param {String} s - The `String` on which the SHA512 will be computed.
     * @returns {String} The SHA512 of `s` as a binary string.
     */
    function(s) {
        return crypto.createHash('sha512').update(s).digest().toString('binary');
    }
);

/**
 * Hash Set class (only stores hash values, not actual elements)
 */
class HashSet {
    /**
     * Initialize a new Hash Set.
     * @constructor
     * @param {String} hash_func - The hash function to use in this Hash Set.
     */
    constructor(hash_func='sha512_str') {
        this.hashsetjs_version = HASHSETJS_VERSION;
        this.hashes = new Set();
        this.hash_func_key = hash_func;
        this.hash_func = HASH_FUNCTIONS.get(hash_func);
    }

    /**
     * Return the total number of elements in this Hash Set (hash collisions will be treated as a single element).
     * @returns {Number} The total number of elements in this Hash Set.
     */
    get size() {
        return this.hashes.size;
    }

    /**
     * Return `true` if this Hash Set is equivalent to the other, otherwise return `false`.
     * @param {Object} other - The other Hash Set against which to compare this one.
     * @returns {Boolean} `true` if `this` is equivalent to `other`, otherwise `false`.
     */
    equals(other) {
        return (typeof this) === (typeof other) &&
               this.hashsetjs_version === other.hashsetjs_version &&
               this.hash_func_key === other.hash_func_key &&
               this.hashes.size === other.hashes.size &&
               [...this.hashes].every(h => other.hashes.has(h));
    }

    /**
     * Insert an element into this Hash Set.
     * @param {Object} x - The element to insert.
     */
    add(x) {
        this.hashes.add(this.hash_func(x));
    }

    /**
     * Remove an element from this Hash Set.
     * @param {object} x - The element to remove.
     */
    delete(x) {
        this.hashes.delete(this.hash_func(x));
    }

    /**
     * Find an element in this Hash Set.
     * @param {Object} x - The element to find.
     * @returns {Boolean}
     */
    has(x) {
        return this.hashes.has(this.hash_func(x));
    }

    /**
     * Get a JSON representation of this Hash Set.
     * @returns {String} The JSON representation of this Hash Set.
     */
    toJSON() {
        return {
            hashsetjs_version: this.hashsetjs_version,
            hashes: Array.from(this.hashes, h => btoa(h)),
            hash_func_key: this.hash_func_key
        };
    }

    /**
     * Load a Hash Set from a JSON representation.
     * @param {JSON} json - The JSON representation from which to load a Hash Set.
     * @returns {HashSet} - The loaded Hash Set.
     */
    static fromJSON(json) {
        const hs = new HashSet(json.hash_func_key);
        hs.hash_func = HASH_FUNCTIONS.get(json.hash_func_key);
        hs.hashsetjs_version = json.hashsetjs_version;
        hs.hashes = new Set(json.hashes.map(h => atob(h)));
        return hs;
    }

    /**
     * Dump this Hash Set into a given file.
     * @param {String} fn - The name of the file into which this Hash Set should be dumped.
     */
    dump(fn) {
        // TODO
    }

    /**
     * Load a Hash Set from a given file.
     * @param {String} fn - The name of the file from which to load a Hash Set.
     */
    static load(fn) {
        // TODO
    }
}

// TEST TODO DELETE
const hs = new HashSet();
hs.add("Niema");
hs.add("Moshiri");
hs.add("Niema");
console.log(hs);
console.log(hs.has("Niema"));
hs.delete("Niema");
console.log(hs);
console.log(hs.has("Niema"));
json = hs.toJSON();
hs2 = HashSet.fromJSON(json);
console.log(hs.equals(hs2));
