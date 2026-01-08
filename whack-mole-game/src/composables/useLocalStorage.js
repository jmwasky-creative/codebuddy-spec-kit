/**
 * localStorage and IndexedDB utilities for data persistence
 */

import { STORAGE_KEYS, IDB_CONFIG, IDB_STORES } from '@utils/constants.js'

let idbDatabase = null

/**
 * localStorage utilities
 */
export const localStorageUtils = {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @returns {Promise<any>} Stored value or null
   */
  async getItem(key) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error(`Error reading from localStorage [${key}]:`, error)
      return null
    }
  },

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage [${key}]:`, error)
      throw error
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage [${key}]:`, error)
      throw error
    }
  }
}

/**
 * IndexedDB utilities
 */
export const indexedDBUtils = {
  /**
   * Open IndexedDB database
   * @returns {Promise<IDBDatabase>} Database instance
   */
  async open() {
    if (idbDatabase) {
      return idbDatabase
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(IDB_CONFIG.DB_NAME, IDB_CONFIG.DB_VERSION)

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        idbDatabase = request.result
        resolve(idbDatabase)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Create game_sessions store
        if (!db.objectStoreNames.contains(IDB_STORES.GAME_SESSIONS)) {
          const gameSessionsStore = db.createObjectStore(IDB_STORES.GAME_SESSIONS, {
            keyPath: 'id',
            autoIncrement: true
          })
          gameSessionsStore.createIndex('startTime', 'startTime', { unique: false })
          gameSessionsStore.createIndex('status', 'status', { unique: false })
        }

        // Create characters store
        if (!db.objectStoreNames.contains(IDB_STORES.CHARACTERS)) {
          const charactersStore = db.createObjectStore(IDB_STORES.CHARACTERS, { keyPath: 'id' })
          charactersStore.createIndex('createdAt', 'createdAt', { unique: false })
          charactersStore.createIndex('prompt', 'prompt', { unique: false })
        }

        // Create puzzle_pieces store
        if (!db.objectStoreNames.contains(IDB_STORES.PUZZLE_PIECES)) {
          const piecesStore = db.createObjectStore(IDB_STORES.PUZZLE_PIECES, { keyPath: 'id' })
          piecesStore.createIndex('sessionId', 'sessionId', { unique: false })
        }

        // Create score_records store
        if (!db.objectStoreNames.contains(IDB_STORES.SCORE_RECORDS)) {
          const scoresStore = db.createObjectStore(IDB_STORES.SCORE_RECORDS, {
            keyPath: 'id',
            autoIncrement: true
          })
          scoresStore.createIndex('score', 'score', { unique: false })
          scoresStore.createIndex('completionTime', 'completionTime', { unique: false })
          scoresStore.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  },

  /**
   * Add data to a store
   * @param {string} storeName - Store name
   * @param {Object} data - Data to add
   * @returns {Promise<IDBValidKey>} Record key
   */
  async add(storeName, data) {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  /**
   * Put data to a store (update or insert)
   * @param {string} storeName - Store name
   * @param {Object} data - Data to put
   * @returns {Promise<IDBValidKey>} Record key
   */
  async put(storeName, data) {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  /**
   * Get data from a store by key
   * @param {string} storeName - Store name
   * @param {any} key - Record key
   * @returns {Promise<Object>} Record data
   */
  async get(storeName, key) {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  /**
   * Get all data from a store
   * @param {string} storeName - Store name
   * @returns {Promise<Array>} All records
   */
  async getAll(storeName) {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  /**
   * Get data from a store by index
   * @param {string} storeName - Store name
   * @param {string} indexName - Index name
   * @param {any} value - Index value
   * @returns {Promise<Array>} Matching records
   */
  async getByIndex(storeName, indexName, value) {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(value)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  },

  /**
   * Delete data from a store by key
   * @param {string} storeName - Store name
   * @param {any} key - Record key
   * @returns {Promise<void>}
   */
  async delete(storeName, key) {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  /**
   * Clear all data from a store
   * @param {string} storeName - Store name
   * @returns {Promise<void>}
   */
  async clear(storeName) {
    const db = await this.open()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  },

  /**
   * Close database connection
   */
  close() {
    if (idbDatabase) {
      idbDatabase.close()
      idbDatabase = null
    }
  }
}

/**
 * Composable for localStorage management
 */
export function useLocalStorage() {
  return {
    ...localStorageUtils,
    indexedDB: indexedDBUtils
  }
}

export default useLocalStorage
