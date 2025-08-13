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
    insert(x) {
        this.hashes.add(this.hash_func(x));
    }
}

// TEST TODO DELETE
const hs = new HashSet();
hs.insert("Niema");
hs.insert("Moshiri");
hs.insert("Niema");
console.log(hs);
