CREATE TABLE setor(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    descricao VARCHAR(500)
);

CREATE TABLE responsavel(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255)
);

CREATE TABLE bem(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    tombo VARCHAR(255),
    aquisicao DATE,
    valor DECIMAL(12,2),
    status VARCHAR(100),
    setor_id INT,
    responsavel_id INT,
    FOREIGN KEY (setor_id) REFERENCES setor(id),
    FOREIGN KEY (responsavel_id) REFERENCES responsavel(id)
);

CREATE TABLE movimentacao(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    bem_id INT,
    setor_origem_id INT,
    setor_destino_id INT,
    data DATE,
    observacao LONGTEXT,
    FOREIGN KEY (bem_id) REFERENCES bem(id),
    FOREIGN KEY (setor_origem_id) REFERENCES setor(id),
    FOREIGN KEY (setor_destino_id) REFERENCES setor(id)
);

CREATE TABLE usuario(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255),
    senha VARCHAR(255)
);