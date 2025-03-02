<h1 align="center">TutorTime 🎓</h1>

<p align="center">Um trabalho para a disciplina de Desenvolvimento de Aplicações com Banco de Dados - 3º Informática do IFSP-Jacareí.</p>

<br>
<p align="center">

<h2>👨‍🏫 Professores Responsáveis</h2>

	•	Carlos Eduardo Duque Polito
	•	Olavo Olímpio de Matos Junior

<h2>🎯 Objetivo do Projeto</h2>

O TutorTime é uma plataforma web desenvolvida para facilitar o gerenciamento de monitorias acadêmicas no IFSP-Jacareí. O sistema permite que alunos encontrem monitorias disponíveis em diferentes disciplinas e que monitores gerenciem suas ofertas de monitoria de forma simples e eficiente, apresentando informações detalhadas sobre cada disciplina para os **alunos interessados**.

<h2>🔨 Funcionalidades e Escopo do Projeto ✖️</h2>

| Funcionalidades do Projeto | Escopo (O que não é o objetivo do projeto) |
|-----------------------------|-------------------------------------------|
| Visualização de Monitorias: Interface com slider para apresentação das disciplinas disponíveis | Sistema de Login/Autenticação: Não há sistema de login nesta versão |
| Gerenciamento de Disciplinas: Adição, edição e remoção de disciplinas no sistema | Chat Entre Usuários: Não possui sistema de comunicação direta |
| Páginas Específicas: Cada disciplina possui sua própria página com informações detalhadas sobre a monitoria, sendo elas: Professor responsável, monitor responsável, dias e horários de monitoria, sala/link de acesso. | Agendamento Online: Não permite marcação de horários pela plataforma |
| Interface Responsiva: Design adaptável para diferentes tamanhos de tela | Sistema de Avaliação: Não possui sistema de feedback das monitorias |
| Sistema de Navegação: Menu intuitivo para acesso às diferentes seções do site | |

<h2>👥 Público-Alvo</h2>

• Estudantes do IFSP-Jacareí que buscam monitoria, organizando de maneira simples, acessível e organizada para os alunos interessados.
• Monitores que oferecem suporte nas disciplinas, divulgando suas monitorias de forma clara e objetiva para os alunos interessados.
• Professores e coordenadores que acompanham as monitorias, para que o aluno possa saber o professor responsável a recorrer em casos de problemas.

<h2>☑️ Requisitos do Sistema </h2>

| Tipo                | Subtópico                         | Descrição                                                                                   |
|---------------------|-----------------------------------|---------------------------------------------------------------------------------------------|
| **Funcional**       | Visualização de Disciplinas       | Sistema deve exibir as disciplinas disponíveis para monitoria                               |
| **Funcional**       | Gerenciamento de Conteúdo         | Interface para adicionar/remover disciplinas                                                |
| **Funcional**       | Navegação Entre Páginas           | Sistema de menu para acesso às diferentes seções                                            |
| **Funcional**       | Responsividade                    | Adaptação para diferentes dispositivos                                                      |
| **Funcional**       | Exibição de Informações           | Cada monitoria deve mostrar seus detalhes específicos                                       |
| **Funcional**       | Manutenibilidade                  | Código organizado e bem estruturado                                                         |
| **Não Funcional**   | Performance                       | Carregamento rápido das páginas e transições suaves                                         |
| **Não Funcional**   | Usabilidade                       | Interface intuitiva e fácil de usar                                                         |
| **Não Funcional**   | Design                            | Interface moderna e agradável com alteração de tema light e dark                            |
| **Não Funcional**   | Segurança                         | Proteção contra ataques comuns                                                              |


<h2>📊 Modelagem do Banco de Dados</h2>

<h3>Diagrama ER</h3>

![image](https://github.com/user-attachments/assets/6cf9aef8-b360-49a4-b7d4-a1171c35e8fd)


<h2>📖 Dicionário de Dados</h2>

<h3>Entidade "professors"</h3>
Essa entidade é necessária para - .
 <br><br>
 
- `id`: É um atributo do tipo INT. É o responsável por criar um **Id único** para o professor - (**CHAVE PRIMÁRIA**).
- `nome`: É um atributo do tipo VARCHAR. É o responsável por armazenar o nome do professor.
- `email`: É um atributo do tipo VARCHAR. É o responsável por armazenar o e-mail do professor.

<h3>Entidade "subjects"</h3>
Essa entidade é necessária para - .
 <br><br>
 
- `id`: É um atributo do tipo INT. É o responsável por criar um **Id único** para o professor - (**CHAVE PRIMÁRIA**).
- `nome`: É um atributo do tipo VARCHAR. É o responsável por armazenar o nome do professor.
- `email`: É um atributo do tipo VARCHAR. É o responsável por armazenar o e-mail do professor.

<h3>Entidade "class"</h3>
Essa entidade é necessária para - .
 <br><br>
 
- `id`: É um atributo do tipo INT. É o responsável por criar um **Id único** para o professor - (**CHAVE PRIMÁRIA**).
- `nome`: É um atributo do tipo VARCHAR. É o responsável por armazenar o nome do professor.
- `email`: É um atributo do tipo VARCHAR. É o responsável por armazenar o e-mail do professor.

<h3>Entidade "tutors"</h3>
Essa entidade é necessária para - .
 <br><br>
 
- `id`: É um atributo do tipo INT. É o responsável por criar um **Id único** para o professor - (**CHAVE PRIMÁRIA**).
- `nome`: É um atributo do tipo VARCHAR. É o responsável por armazenar o nome do professor.
- `email`: É um atributo do tipo VARCHAR. É o responsável por armazenar o e-mail do professor.
  

<h2>🛠️ Arquitetura da Aplicação</h2>

![Captura de tela 2024-10-31 150432](https://github.com/user-attachments/assets/5f1e6161-e98d-449a-9bd5-f99f8e264ca1)
<h3>Arquitetura de Software</h3>
![excalidraw](https://github.com/user-attachments/assets/051eeb80-5ff9-40ac-bd4b-5eed829b74e4)



<h2>⚛Tecnologias Utilizadas</h2>

• HTML5: Estruturação das páginas
• CSS3: Estilização e responsividade
• JavaScript: Interatividade e funcionalidades dinâmicas
• Git: Controle de versão
• GitHub: Hospedagem do repositório


<h2>🎨 Design da Interface do Usuário</h2>

<h3>Wireframes ou Mockups</h3>

Link para o Canva com apresentação do projeto **contendo o mockup** das principais telas.

<h3>Descrição das Funcionalidades</h3>

• **Página Inicial (Home)**: Apresenta um slider interativo com todas as disciplinas disponíveis para monitoria, permitindo navegação intuitiva entre elas, como:
  - Nome da disciplina
  - Cursos sugeridos
  - Links para informações adicionais
  - Detalhes sobre a monitoria

• **Páginas de Disciplinas**: Cada disciplina possui sua própria página com informações específicas sobre:
  - Professor responsável
  - Monitor responsável
  - Dias e horários de monitoria
  - Sala/Link de acesso

• **Página About**: Apresenta informações sobre os desenvolvedores e apoiadores do projeto, incluindo:
  - Perfil dos desenvolvedores
  - Informações sobre a direção e coordenação
  - Histórico e objetivos do projeto

• **Página de Gerenciamento (Manage)**: Interface administrativa que permite:
  - Adicionar novas disciplinas
  - Remover disciplinas existentes
  - Editar informações das disciplinas
  - Upload de imagens para as disciplinas
  - Gerenciamento dos cursos sugeridos

<h2>👨‍💻 Desenvolvedores</h2>

<h3>Equipe Dev</h3>

| | [<img loading="lazy" src="css/IMG_5405.jpeg" width=115><br><sub>Luis Henrique dos Santos Abrantes</sub>](https://github.com/LuisAbrantes) |  [<img loading="lazy" src="https://avatars.githubusercontent.com/u/149614643?v=4" width=115><br><sub>Isaque Estolano de Souza</sub>](https://github.com/IsaquePy) |  [<img loading="lazy" src="https://avatars.githubusercontent.com/u/102776070?v=4" width=115><br><sub>Cauã Almeida Moura</sub>](https://github.com/cauaalmeida14052007) |
| :---: | :---: | :---: | :---: |
