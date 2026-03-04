<div align="center">

📄 Ready4Office

Ferramentas PDF Online • Rápidas • Seguras • 100% no Navegador

<!-- Badges das Tecnologias -->

<img src="https://www.google.com/search?q=https://img.shields.io/badge/Next.js-000000%3Fstyle%3Dfor-the-badge%26logo%3Dnextdotjs%26logoColor%3Dwhite" alt="Next.js" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/React-20232A%3Fstyle%3Dfor-the-badge%26logo%3Dreact%26logoColor%3D61DAFB" alt="React" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Tailwind_CSS-38B2AC%3Fstyle%3Dfor-the-badge%26logo%3Dtailwind-css%26logoColor%3Dwhite" alt="Tailwind CSS" />
<img src="https://www.google.com/search?q=https://img.shields.io/badge/Status-Em%2520Produ%25C3%25A7%25C3%25A3o-success%3Fstyle%3Dfor-the-badge" alt="Status: Em Produção" />

</div>

<br />

💡 Ready4Office é uma plataforma SaaS (Software as a Service) focada em simplificar a rotina de escritório. Oferece ferramentas de manipulação de PDF que funcionam inteiramente na sua máquina, sem a necessidade de enviar ficheiros sensíveis para servidores de terceiros.

✨ Funcionalidades Principais

✍️ Editor de PDF: Adicione textos e preencha formulários diretamente no navegador com uma interface drag and drop intuitiva.

🔗 Juntar PDFs (Merge): Selecione múltiplos ficheiros, organize a ordem das páginas visualmente e una-os num único documento.

📄 Modelos Prontos: Galeria de modelos em branco (Recibos, Declarações, Contratos) otimizada para SEO e atração de tráfego orgânico.

🔒 Privacidade Total: Processamento Client-Side. Os seus documentos nunca saem do seu computador.

🌍 Internacionalização (i18n): Suporte nativo para Português (PT) e Inglês (EN).

🌙 Modo Escuro (Dark Mode): Tema claro e escuro persistente, guardado no localStorage.

🛠️ Tecnologias Utilizadas

Este projeto foi desenhado com foco em alta performance e renderização estática:

Tecnologia

Descrição

Next.js (App Router)

Framework React para rotas isoladas e geração estática (SSG).

Tailwind CSS v4

Estilização utilitária de alta performance com Dark Mode customizado.

PDF-lib

Biblioteca robusta para criação e modificação estrutural de documentos PDF.

PDF.js (Mozilla)

Motor de renderização de páginas PDF em <canvas> para pré-visualização.

⚙️ Como executar localmente

Pré-requisitos: Node.js instalado na sua máquina.

Clone o repositório:

git clone [https://github.com/SEU_USUARIO/ready4office.git](https://github.com/SEU_USUARIO/ready4office.git)
cd ready4office


Instale as dependências:

npm install


Inicie o servidor de desenvolvimento:

npm run dev


Acesse no navegador:
Abra http://localhost:3000 para ver o site em funcionamento.

📦 Deploy para Produção (Hostinger, Vercel, etc.)

Este projeto utiliza o recurso output: 'export' do Next.js, gerando ficheiros HTML/CSS puros de altíssima velocidade.

Compile o projeto executando:

npm run build


O Next.js irá gerar uma pasta chamada /out.

Copie todo o conteúdo de dentro da pasta /out e cole na pasta public_html do seu servidor (ex: Hostinger).

<div align="center">
<sub>Desenvolvido com foco em arquitetura modular e resolução de problemas reais.</sub>
</div>