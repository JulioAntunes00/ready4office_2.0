# Deploy para Hostinger (HTML Estático)

## Passos para Build Estático

### 1. Build do Projeto
```bash
npm run build
```

### 2. Exportar para HTML Estático
Adicione ao `package.json`:
```json
{
  "scripts": {
    "export": "next build && next export"
  }
}
```

Execute:
```bash
npm run export
```

### 3. Arquivos Gerados
O build estático será gerado na pasta `out/` contendo:
- Arquivos HTML estáticos
- CSS e JS otimizados
- Assets das ferramentas PDF

### 4. Upload para Hostinger
- Compacte a pasta `out/`
- Faça upload via File Manager do Hostinger
- Extraia na pasta public_html

## Contador de Visitas

O contador agora funciona 100% localmente:

### ✅ Vantagens
- **Sem dependência de API**: Funciona offline
- **Ignora bots**: Detecção avançada de crawlers
- **Build estático**: Compatível com HTML puro
- **Persistência**: Usa localStorage do navegador

### 🛡️ Detecção de Bots
- User Agents suspeitos
- Navegadores headless
- Ausência de plugins
- Comportamentos anômalos

### 📊 Funcionalidades
- **Contagem cumulativa**: Nunca reseta, sempre incrementa
- **Múltiplos acessos**: Conta cada visitação individualmente
- **Formatação inteligente**: 1K, 1.5M para grandes números
- **Funciona em modo escuro/claro**

## Configuração Adicional

### Next.js Config
Crie `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### Variáveis de Ambiente
Se precisar de configurações específicas:
```bash
NEXT_PUBLIC_SITE_URL=https://seusite.com
```

## Testes

### Testar Localmente
```bash
npm run dev
```

### Testar Build Estático
```bash
npm run build
npm run start
```

### Verificar Contador
1. Abra o site em modo anônimo
2. Verifique o contador no footer
3. Teste com diferentes user agents

## Solução de Problemas

### Erros Comuns
- **CORS**: Resolvido - não usa mais API externa
- **Build estático**: Configurado com `output: 'export'`
- **Imagens**: Desativada otimização para HTML estático

### Performance
- Carregamento instantâneo
- Sem requisições externas
- Cache automático do navegador
