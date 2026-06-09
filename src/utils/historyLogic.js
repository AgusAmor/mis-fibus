export const HISTORY_DELAY_MS = 0; // Configurable: 10 * 60 * 1000 para 10 minutos.

export const ACTION_TYPES = {
  OBTENIDA: 'OBTENIDA',
  ELIMINADA: 'ELIMINADA',
  REPETIDA_AGREGADA: 'REPETIDA_AGREGADA',
  REPETIDA_ELIMINADA: 'REPETIDA_ELIMINADA',
  FAVORITA_AGREGADA: 'FAVORITA_AGREGADA',
  FAVORITA_ELIMINADA: 'FAVORITA_ELIMINADA',
};

const OPPOSITE_ACTIONS = {
  [ACTION_TYPES.OBTENIDA]: ACTION_TYPES.ELIMINADA,
  [ACTION_TYPES.ELIMINADA]: ACTION_TYPES.OBTENIDA,
  [ACTION_TYPES.REPETIDA_AGREGADA]: ACTION_TYPES.REPETIDA_ELIMINADA,
  [ACTION_TYPES.REPETIDA_ELIMINADA]: ACTION_TYPES.REPETIDA_AGREGADA,
  [ACTION_TYPES.FAVORITA_AGREGADA]: ACTION_TYPES.FAVORITA_ELIMINADA,
  [ACTION_TYPES.FAVORITA_ELIMINADA]: ACTION_TYPES.FAVORITA_AGREGADA,
};

/**
 * Agrega un nuevo evento al historial de la figurita.
 * Si la acción opuesta ocurrió dentro del tiempo de gracia (HISTORY_DELAY_MS),
 * se cancelan mutuamente y el evento anterior desaparece en lugar de registrar uno nuevo.
 * 
 * @param {Array} currentHistory El array actual de historial.
 * @param {string} action El tipo de acción a registrar (ACTION_TYPES).
 * @returns {Array} El nuevo array de historial actualizado.
 */
export const appendHistoryEvent = (currentHistory = [], action) => {
  const now = Date.now();
  const history = [...currentHistory];

  const opposite = OPPOSITE_ACTIONS[action];
  
  if (opposite && history.length > 0) {
    // Buscar si el último evento fue la acción opuesta y ocurrió dentro del delay
    const lastEvent = history[history.length - 1];
    const timeSinceLastEvent = now - new Date(lastEvent.timestamp).getTime();

    if (lastEvent.action === opposite && timeSinceLastEvent <= HISTORY_DELAY_MS) {
      // Si estamos dentro del tiempo de gracia, cancelamos la acción opuesta eliminándola
      history.pop();
      return history;
    }
  }

  // Si no se canceló nada, agregamos el nuevo evento
  history.push({
    action,
    timestamp: new Date(now).toISOString()
  });

  return history;
};

/**
 * Filtra el historial general para mostrar solo los eventos 
 * que ya superaron el tiempo de retraso para hacerse públicos.
 * 
 * @param {Object} stickersState El estado global de todas las figuritas.
 * @returns {Array} Una lista plana de eventos ordenados por fecha descendente.
 */
export const getVisibleHistory = (stickersState) => {
  const now = Date.now();
  const allEvents = [];

  Object.entries(stickersState).forEach(([stickerId, data]) => {
    if (!data.history || !Array.isArray(data.history)) return;

    data.history.forEach(event => {
      const eventTime = new Date(event.timestamp).getTime();
      // Solo mostramos los eventos que ya superaron el delay
      if (now - eventTime >= HISTORY_DELAY_MS) {
        allEvents.push({
          stickerId,
          ...event
        });
      }
    });
  });

  // Ordenar de más reciente a más antiguo
  return allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
