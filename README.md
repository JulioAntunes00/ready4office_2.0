📄 Ready4Office

Ready4Office é uma plataforma SaaS (Software as a Service) focada em simplificar a rotina de escritório. Oferece ferramentas de manipulação de PDF rápidas, seguras e que funcionam inteiramente no navegador do utilizador, sem a necessidade de enviar ficheiros sensíveis para servidores de terceiros.

🚀 Funcionalidades Principais

Editor de PDF: Adicione textos e preencha formulários diretamente no navegador com uma interface drag and drop intuitiva.

Juntar PDFs (Merge): Selecione múltiplos ficheiros PDF, organize a ordem das páginas arrastando e soltando, e una-os num único documento.

Modelos Prontos: Galeria de modelos em branco (Recibos, Declarações, Contratos) otimizada para SEO e atração de tráfego orgânico.

Processamento Local (Privacidade): Utiliza bibliotecas Client-Side para processar os PDFs na máquina do utilizador, garantindo 100% de privacidade.

Internacionalização (i18n): Suporte nativo para Português (PT) e Inglês (EN).

Modo Escuro (Dark Mode): Tema claro e escuro persistente, guardado nas preferências do navegador (localStorage).

🛠️ Tecnologias Utilizadas

Este projeto foi construído com foco em performance e renderização estática:

Next.js (App Router): Framework React para rotas isoladas e otimização de SEO.

Tailwind CSS v4: Estilização utilitária com suporte a Dark Mode customizado.

pdf-lib: Criação e modificação de documentos PDF.

pdf.js (Mozilla): Renderização de páginas PDF em <canvas> para pré-visualização.

⚙️ Como executar o projeto localmente

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

📦 Como gerar a versão de Produção (Deploy Estático)

Este projeto está configurado para exportação estática (output: 'export'), ideal para alojamento rápido como Hostinger, Vercel ou GitHub Pages.

Compile o projeto:

npm run build


Deploy:
O Next.js irá gerar uma pasta chamada /out. Basta transferir o conteúdo dessa pasta para o diretório public_html da sua hospedagem.

👨‍💻 Desenvolvedor

Projeto desenvolvido com foco em resolução de problemas reais de escritório e arquitetura de software modular.