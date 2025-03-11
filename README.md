# QR Code Redirect API

Este projeto é uma API simples que permite redirecionar usuários a um link específico, rastrear acessos provenientes de QR Codes e visualizar estatísticas de acessos.

## Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- dotenv
- QRCode

## Instalação

1. Clone este repositório:
   ```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. Acesse o diretório do projeto:
   ```sh
   cd seu-repositorio
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Configure o arquivo `.env` com as credenciais do banco de dados:
   ```env
   DB_USER=seu_usuario
   DB_HOST=seu_host
   DB_DATABASE=seu_banco_de_dados
   DB_PASSWORD=sua_senha
   DB_PORT=5432
   ```

## Uso

1. Inicie o servidor:
   ```sh
   npm start
   ```
2. A API fornecerá endpoints para gerar QR Codes, redirecionar usuários e visualizar estatísticas de acessos.

## Endpoints

### `POST /api/generate`

**Descrição:** Gera um QR Code para uma URL fornecida e a armazena no banco de dados.

**Body:**
```json
{
  "url": "https://exemplo.com"
}
```

**Resposta:**
```json
{
  "qrCodeURL": "http://localhost:8080/track/abc123",
  "qrImage": "data:image/png;base64,..."
}
```

### `GET /track/:code`

**Descrição:** Redireciona o usuário para a URL original associada ao código curto e rastreia o acesso.

**Parâmetros:**
- `code` (string): Código curto gerado para a URL.

**Exemplo de Uso:**
```sh
GET http://localhost:8080/track/abc123
```

### `GET /stats`

**Descrição:** Retorna estatísticas de acesso para cada URL encurtada.

**Resposta:**
```json
[
  {
    "short_code": "abc123",
    "original_url": "https://exemplo.com",
    "access_count": 5
  }
]
```

## Banco de Dados
A API armazena dados de rastreamento, como:
- ID do QR Code
- URL original
- Código curto
- Número de acessos

## Contribuição
Sinta-se à vontade para contribuir com melhorias no projeto! Faça um fork, crie uma branch e envie um pull request.

## Licença
Este projeto está licenciado sob a MIT License.

