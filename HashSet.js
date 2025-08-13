// imports
const crypto = require('crypto');

// useful constants
const HASHSETJS_VERSION = '0.0.1';

// hash functions
const HASH_FUNCTIONS = new Map();
HASH_FUNCTIONS.set('sha512_str', function(s) {
    crypto.createHash('sha512').update(s).digest();
}

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
        // do `if hash_func not in HASH_FUNCTIONS_HASHSET: raise ValueError(...)` check: https://github.com/niemasd/NiemaBF/blob/6e7768efcafea07642226b073cd215c59d8d290e/niemabf/HashSet.py#L25-L26
        self.hashsetjs_version = HASHSETJS_VERSION;
        self.hashes = new Map();
        self.hash_func_key = hash_func;
        self.hash_func = HASH_FUNCTIONS[hash_func]; // TODO DOUBLE CHECK MAP USAGE
    }
}
