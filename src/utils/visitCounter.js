// Detector de bots e contador de visitas local
export const isBot = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /perl/i,
    /php/i,
    /node/i,
    /go-http/i,
    /postman/i,
    /insomnia/i,
    /httpie/i,
    /axios/i,
    /fetch/i
  ];

  // Verificar user agent
  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    return true;
  }

  // Verificar cabeçalhos comuns de bots
  const botHeaders = [
    'x-robots-tag',
    'x-bot',
    'bot-detect',
    'crawler'
  ];

  // Verificar comportamentos suspeitos
  if (window.performance && window.performance.navigation) {
    const navigationType = window.performance.navigation.type;
    // Navigation type 0 = normal, 1 = reload, 2 = back/forward
    // Bots muitas vezes não têm navegação normal
    if (navigationType === 0 && document.referrer === '') {
      // Pode ser um acesso direto, mas vamos verificar outros fatores
    }
  }

  // Verificar se está em headless (comum para bots)
  if (navigator.webdriver) {
    return true;
  }

  // Verificar se tem plugins (bots geralmente não têm)
  if (navigator.plugins.length === 0) {
    return true;
  }

  return false;
};

export const getVisitCount = () => {
  if (typeof window === 'undefined') return 0;
  
  const storageKey = 'ready4office_visit_count';
  
  // Incrementar em cada acesso (mesmo da mesma pessoa)
  const currentCount = parseInt(localStorage.getItem(storageKey) || '0') + 1;
  localStorage.setItem(storageKey, currentCount.toString());
  
  return currentCount;
};

export const incrementVisitCount = () => {
  if (typeof window === 'undefined' || isBot()) return 0;
  
  return getVisitCount();
};

export const formatVisitCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};
