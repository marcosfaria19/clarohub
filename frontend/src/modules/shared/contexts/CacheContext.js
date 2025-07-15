import React, { createContext, useContext, useCallback, useRef } from "react";

/**
 * CacheContext - Context principal para gerenciamento de cache global
 *
 * Características:
 * - Cache em memória usando Map para performance otimizada
 * - TTL configurável por tipo de dados
 * - Invalidação manual e automática
 * - Compartilhamento entre componentes
 * - Logs para debug (opcional)
 */

// Configurações de TTL por tipo de dados (em milissegundos)
const TTL_CONFIG = {
  users: 2 * 60 * 60 * 1000, // 2 horas
  projects: 6 * 60 * 60 * 1000, // 6 horas
  netfacil: 6 * 60 * 60 * 1000, // 6 horas
};

// Context
const CacheContext = createContext(null);

/**
 * Provider do CacheContext
 */
export function CacheProvider({ children, enableLogs = false }) {
  // Cache principal usando Map para melhor performance
  const cache = useRef(new Map());

  // Função para logs de debug
  const log = useCallback(
    (message, data = null) => {
      if (enableLogs) {
        console.log(`[Cache] ${message}`, data || "");
      }
    },
    [enableLogs],
  );

  /**
   * Gera chave única para o cache baseada no tipo e parâmetros
   */
  const generateKey = useCallback((type, params = {}) => {
    const paramString = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join("|");
    return paramString ? `${type}:${paramString}` : type;
  }, []);

  /**
   * Verifica se um item do cache ainda é válido
   */
  const isValid = useCallback((cacheItem, ttl) => {
    if (!cacheItem) return false;
    const now = Date.now();
    const isStillValid = now - cacheItem.timestamp < ttl;
    return isStillValid;
  }, []);

  /**
   * Obtém dados do cache
   */
  const get = useCallback(
    (type, params = {}) => {
      const key = generateKey(type, params);
      const cacheItem = cache.current.get(key);
      const ttl = TTL_CONFIG[type] || TTL_CONFIG.users; // fallback para users TTL

      if (isValid(cacheItem, ttl)) {
        log(`Cache HIT para ${key}`);
        return cacheItem.data;
      }

      log(`Cache MISS para ${key}`);
      return null;
    },
    [generateKey, isValid, log],
  );

  /**
   * Armazena dados no cache
   */
  const set = useCallback(
    (type, data, params = {}) => {
      const key = generateKey(type, params);
      const cacheItem = {
        data,
        timestamp: Date.now(),
        type,
        params,
      };

      cache.current.set(key, cacheItem);
      log(`Cache SET para ${key}`, { dataSize: JSON.stringify(data).length });
    },
    [generateKey, log],
  );

  /**
   * Invalida uma chave específica do cache
   */
  const invalidateKey = useCallback(
    (type, params = {}) => {
      const key = generateKey(type, params);
      const deleted = cache.current.delete(key);
      log(`Cache INVALIDATE para ${key}`, { deleted });
      return deleted;
    },
    [generateKey, log],
  );

  /**
   * Invalida todas as chaves de um tipo específico
   */
  const invalidateType = useCallback(
    (type) => {
      let deletedCount = 0;
      for (const [key, cacheItem] of cache.current.entries()) {
        if (cacheItem.type === type) {
          cache.current.delete(key);
          deletedCount++;
        }
      }
      log(`Cache INVALIDATE TYPE ${type}`, { deletedCount });
      return deletedCount;
    },
    [log],
  );

  /**
   * Invalida todo o cache
   */
  const invalidateAll = useCallback(() => {
    const size = cache.current.size;
    cache.current.clear();
    log(`Cache INVALIDATE ALL`, { clearedItems: size });
    return size;
  }, [log]);

  /**
   * Obtém estatísticas do cache
   */
  const getStats = useCallback(() => {
    const stats = {
      totalItems: cache.current.size,
      types: {},
      oldestItem: null,
      newestItem: null,
    };

    let oldestTimestamp = Date.now();
    let newestTimestamp = 0;

    for (const [key, cacheItem] of cache.current.entries()) {
      // Contagem por tipo
      if (!stats.types[cacheItem.type]) {
        stats.types[cacheItem.type] = 0;
      }
      stats.types[cacheItem.type]++;

      // Timestamps
      if (cacheItem.timestamp < oldestTimestamp) {
        oldestTimestamp = cacheItem.timestamp;
        stats.oldestItem = { key, timestamp: cacheItem.timestamp };
      }
      if (cacheItem.timestamp > newestTimestamp) {
        newestTimestamp = cacheItem.timestamp;
        stats.newestItem = { key, timestamp: cacheItem.timestamp };
      }
    }

    return stats;
  }, []);

  /**
   * Limpa itens expirados do cache
   */
  const cleanup = useCallback(() => {
    let cleanedCount = 0;
    const now = Date.now();

    for (const [key, cacheItem] of cache.current.entries()) {
      const ttl = TTL_CONFIG[cacheItem.type] || TTL_CONFIG.users;
      if (now - cacheItem.timestamp >= ttl) {
        cache.current.delete(key);
        cleanedCount++;
      }
    }

    log(`Cache CLEANUP`, { cleanedCount });
    return cleanedCount;
  }, [log]);

  // Valor do contexto
  const contextValue = {
    get,
    set,
    invalidateKey,
    invalidateType,
    invalidateAll,
    getStats,
    cleanup,
    TTL_CONFIG,
  };

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  );
}

/**
 * Hook para usar o cache context
 */
export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error("useCache deve ser usado dentro de um CacheProvider");
  }
  return context;
}

export default CacheContext;
