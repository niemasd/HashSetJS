// imports
const crypto = require('crypto');

// useful constants
const HASHSETJS_VERSION = '0.0.1';

// hash functions
const HASH_FUNCTIONS = new Map();
HASH_FUNCTIONS.set('sha512_str',
    /**
     * Wrapper to compute SHA512 on a `string`.
     * @param {string} s - The `string` on which the SHA512 will be computed.
     * @returns {binary} The SHA512 of `s`.
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
     * @param {string} hash_func - The hash function to use in this Hash Set.
     */
    constructor(hash_func='sha512_str') {
        this.hashsetjs_version = HASHSETJS_VERSION;
        this.hashes = new Set();
        this.hash_func_key = hash_func;
        this.hash_func = HASH_FUNCTIONS.get(hash_func);
    }

    /**
     * Return the total number of elements in this Hash Set (hash collisions will be treated as a single element).
     * @returns {int} The total number of elements in this Hash Set.
     */
    get size() {
        return this.hashes.size;
    }

    /**
     * Insert an element into this Hash Set.
     * @param {object} x - The element to insert.
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
     * @param {object} x - The element to find.
     */
    has(x) {
        return this.hashes.has(this.hash_func(x));
    }

    /**
     * Dump this Hash Set into a given file.
     * @param {string} fn - The name of the file into which this Hash Set should be dumped.
     */
    dump(fn) {
        // TODO
    }

    /**
     * Load a Hash Set from a given file.
     * @param {string} fn - The name of the file from which to load a Hash Set.
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
