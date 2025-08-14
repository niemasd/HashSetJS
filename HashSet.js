// IMPORTS START
const crypto = require('crypto');
const fs = require('fs');
// IMPORTS END

// CONSTANTS START
const HASHSETJS_VERSION = '1.0.1';
// CONSTANTS END

// HELPER FUNCTIONS START
/**
 * Helper wrapper to compute various hash algorithms on a `String`.
 * @param {String} s - The `String` on which the hash will be computed.
 * @param {String} algorithm - The hash algorithm to compute.
 * @returns {String} The hash of `s` as a binary string.
 */
function crypto_hash(s, algorithm) {
    return crypto.createHash(algorithm).update(s).digest().toString('binary');
}
// HELPER FUNCTIONS END

// HASH FUNCTIONS START
/**
 * Wrapper to compute SHA256 on a `String`.
 * @param {String} s - The `String` on which the SHA256 will be computed.
 * @returns {String} The SHA256 of `s` as a binary string.
 */
function sha256_str(s) {
    return crypto_hash(s, 'sha256');
}

/**
 * Wrapper to compute SHA512 on a `String`.
 * @param {String} s - The `String` on which the SHA512 will be computed.
 * @returns {String} The SHA512 of `s` as a binary string.
 */
function sha512_str(s) {
    return crypto_hash(s, 'sha512');
}

// maps to store relevant info about hash functions
const HASH_FUNCTIONS = new Map([
    ['sha256_str', sha256_str],
    ['sha512_str', sha512_str],
]);
const HASH_LENGTHS = new Map([
    ['sha256_str', 32],
    ['sha512_str', 64],
]);
// HASH FUNCTIONS END

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
        //const headerBuffer = Buffer.from(`${this.hashsetjs_version}\n${this.hash_func_key}\n`, 'utf8');
        //const hashesBuffer = Array.from(this.hashes, h => { return Buffer.from(h, 'binary'); });
        const fileBuffer = Buffer.concat([
            Buffer.from(`${this.hashsetjs_version}\n${this.hash_func_key}\n`, 'utf8'),
            ...Array.from(this.hashes, h => { return Buffer.from(h, 'binary'); })
        ]);
        fs.writeFileSync(fn, fileBuffer);
    }

    /**
     * Load a Hash Set from a given file.
     * @param {String} fn - The name of the file from which to load a Hash Set.
     */
    static load(fn) {
        // load file and parse header (`hashsetjs_version` + '\n' + `hash_func_key` + '\n')
        const fileBuffer = fs.readFileSync(fn);
        const firstNL = fileBuffer.indexOf(0x0A); // 0x0A = '\n'
        if(firstNL === -1) {
            throw new Error(`Invalid header HashSetJS file (missing HashSetJS version): ${fn}`);
        }
        const secondNL = fileBuffer.indexOf(0x0A, firstNL + 1); // 0x0A = '\n'
        if(secondNL === -1) {
            throw new Error(`Invalid header HashSetJS file (missing hash function key): ${fn}`);
        }

        // extract instance variables from header
        const hashsetjs_version = fileBuffer.slice(0, firstNL).toString('utf8');
        const hash_func_key = fileBuffer.slice(firstNL + 1, secondNL).toString('utf8');
        if(!HASH_FUNCTIONS.has(hash_func_key)) {
            throw new Error(`Invalid hash function (${hash_func_key}) in HashSetJS file: ${fn}`);
        }
        const hashLen = HASH_LENGTHS.get(hash_func_key);
        if((fileBuffer.length - secondNL - 1) % hashLen != 0) {
            throw new Error(`Hash function (${hash_func_key}) produces ${hashLen}-byte hashes, but body of HashSetJS file is not perfectly divisible: ${fn}`);
        }

        // create `HashSet` and return
        const hs = new HashSet(hash_func_key);
        hs.hashsetjs_version = hashsetjs_version;
        this.hash_func = HASH_FUNCTIONS.get(hash_func_key);
        for(let offset = secondNL + 1; offset + hashLen <= fileBuffer.length; offset += hashLen) {
            hs.hashes.add(fileBuffer.slice(offset, offset + hashLen).toString('binary'));
        }
        return hs;
    }
}

// TODO DELETE
console.log("Creating new Hash Set...");
const hs = new HashSet('sha512_str');
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
