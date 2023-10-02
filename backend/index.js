const express=require('express')
const app = express();
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
​
app.listen(666, () => console. log("Aplicao respondendo na porta 666."));
​
const mysql = require('mysql2/promise')
const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: ''
})
​
app.get('/',(req,res)=>{
    res.send("Anderson");
})
​
const getAllPessoas = async () =>{
    const [query] = await connection
    .execute('select * from TestePessoa.Pessoa');
    return query;
}
app.get('/pessoa', async (req,res)=>{
    const consulta = await getAllPessoas();
    return res.status(200).json(consulta);
})
​
app.get('/pessoa/:id', async (req,res)=>{
    const {id} = req.params;
    const [query] = await connection.execute('select * from TestePessoa.Pessoa where id = ?', [id]);
    if(query.length === 0) return res.status(400).json({mensagem: 'Nao encontrado.'})
    return res.status(200).json(query);
})
​
app.get('/pessoa/busca/:nome', async (req,res)=>{
    const {id} = req.params;
    const [query] = await connection.execute('select * from TestePessoa.Pessoa where id = ?', [id]);
    if(query.length === 0) return res.status(400).json({mensagem: 'Nao encontrado.'})
    return res.status(200).json(query);
})
​
app.post('/pessoa', async (req,res)=>{
    const {nome, email} = req.body;
    const [query]= await connection.
    execute('insert into TestePessoa.Pessoa (nome,email) values(?,?)', 
    [nome,email])
    return res.status(200).json(query);
})
app.delete('/pessoa/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await connection.execute('DELETE FROM TestePessoa.Pessoa WHERE id = ?', [id]);
      return res.status(200).json({ mensagem: 'Pessoa excluída com sucesso.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: 'Erro ao excluir a pessoa.' });
    }
  });

  app.put('/pessoa/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    
    try {
      const [result] = await connection.execute('SELECT * FROM TestePessoa.Pessoa WHERE id = ?', [id]);
      if (result.length === 0) {
        return res.status(404).json({ mensagem: 'Pessoa não encontrada.' });
      }
      
      await connection.execute('UPDATE TestePessoa.Pessoa SET nome = ?, email = ? WHERE id = ?', [nome, email, id]);
      
      return res.status(200).json({ mensagem: 'Pessoa atualizada com sucesso.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: 'Erro ao atualizar a pessoa.' });
    }
  });

  //começo da montagem dos models para o crud de todas as tabelas do banco

// Create - tabela campanha
app.post('/campanha', async (req, res) => {
    const { NOME, EMAIL, SENHA, id_usuario } = req.body;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('INSERT INTO CAMPANHA (NOME, EMAIL, SENHA, id_usuario) VALUES (?, ?, ?, ?)', [NOME, EMAIL, SENHA, id_usuario]);
      return res.status(200).json({ mensagem: 'Campanha criada com sucesso.' });
    } finally {
      connection.release();
    }
  });

  //read - tabela campanha (todas)
  app.get('/campanha', async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.query('SELECT * FROM CAMPANHA');
      return res.status(200).json(query);
    } finally {
      connection.release();
    }
  });

// read - tabela campanha (pelo id)
app.get('/campanha/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.query('SELECT * FROM CAMPANHA WHERE ID = ?', [id]);
      if (query.length === 0) return res.status(404).json({ mensagem: 'Campanha não encontrada.' });
      return res.status(200).json(query);
    } finally {
      connection.release();
    }
  });

  //update - tabela campanha
  app.put('/campanha/:id', async (req, res) => {
    const { id } = req.params;
    const { NOME, EMAIL, SENHA, id_usuario } = req.body;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('UPDATE CAMPANHA SET NOME = ?, EMAIL = ?, SENHA = ?, id_usuario = ? WHERE ID = ?', [NOME, EMAIL, SENHA, id_usuario, id]);
      return res.status(200).json({ mensagem: 'Campanha atualizada com sucesso.' });
    } finally {
      connection.release();
    }
  });

  //delete- tabela campanha
  app.delete('/campanha/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('DELETE FROM CAMPANHA WHERE ID = ?', [id]);
      return res.status(200).json({ mensagem: 'Campanha excluída com sucesso.' });
    } finally {
      connection.release();
    }
  });

  // tabela doacao

  // create - tabela doacao
  app.post('/doacao', async (req, res) => {
    const { CAMPANHA_ID, VALOR, STATUS, metodoPag } = req.body;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('INSERT INTO DOACAO (CAMPANHA_ID, VALOR, STATUS, metodoPag) VALUES (?, ?, ?, ?)', [CAMPANHA_ID, VALOR, STATUS, metodoPag]);
      return res.status(200).json({ mensagem: 'Doação criada com sucesso.' });
    } finally {
      connection.release();
    }
  });

  // read - tabela doacao (todas)
  app.get('/doacao', async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.query('SELECT * FROM DOACAO');
      return res.status(200).json(query);
    } finally {
      connection.release();
    }
  });

  // read tabela doacao (pelo id)
  app.get('/doacao/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.query('SELECT * FROM DOACAO WHERE ID = ?', [id]);
      if (query.length === 0) return res.status(404).json({ mensagem: 'Doação não encontrada.' });
      return res.status(200).json(query);
    } finally {
      connection.release();
    }
  });

  //update - tabela doacao
  app.put('/doacao/:id', async (req, res) => {
    const { id } = req.params;
    const { CAMPANHA_ID, VALOR, STATUS, metodoPag } = req.body;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('UPDATE DOACAO SET CAMPANHA_ID = ?, VALOR = ?, STATUS = ?, metodoPag = ? WHERE ID = ?', [CAMPANHA_ID, VALOR, STATUS, metodoPag, id]);
      return res.status(200).json({ mensagem: 'Doação atualizada com sucesso.' });
    } finally {
      connection.release();
    }
  });

  // delete - tabela doacao

  app.delete('/doacao/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('DELETE FROM DOACAO WHERE ID = ?', [id]);
      return res.status(200).json({ mensagem: 'Doação excluída com sucesso.' });
    } finally {
      connection.release();
    }
  });

  //tabela doador
  //cerate - tabela doador
  app.post('/doador', async (req, res) => {
    const { nome, email, senha, endereco, telefone, cpf, cidade, cep, estado } = req.body;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('INSERT INTO DOADOR (nome, email, senha, endereco, telefone, cpf, cidade, cep, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [nome, email, senha, endereco, telefone, cpf, cidade, cep, estado]);
      return res.status(200).json({ mensagem: 'Doador criado com sucesso.' });
    } finally {
      connection.release();
    }
  });

  // read- tabela doador (pelo id)
  app.get('/doador/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.query('SELECT * FROM DOADOR WHERE id = ?', [id]);
      if (query.length === 0) return res.status(404).json({ mensagem: 'Doador não encontrado.' });
      return res.status(200).json(query);
    } finally {
      connection.release();
    }
  });

  // update - tabela doacao
  app.put('/doador/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, endereco, telefone, cpf, cidade, cep, estado } = req.body;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('UPDATE DOADOR SET nome = ?, email = ?, senha = ?, endereco = ?, telefone = ?, cpf = ?, cidade = ?, cep = ?, estado = ? WHERE id = ?', [nome, email, senha, endereco, telefone, cpf, cidade, cep, estado, id]);
      return res.status(200).json({ mensagem: 'Doador atualizado com sucesso.' });
    } finally {
      connection.release();
    }
  });

  //delete -tabela doacao
  app.delete('/doador/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('DELETE FROM DOADOR WHERE id = ?', [id]);
      return res.status(200).json({ mensagem: 'Doador excluído com sucesso.' });
    } finally {
      connection.release();
    }
  });

  // create - tabela usuário
  app.post('/usuario', async (req, res) => {
    const { nome_usuario, email_usuario, senha } = req.body;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('INSERT INTO USUARIO (nome_usuario, email_usuario, senha) VALUES (?, ?, ?)', [nome_usuario, email_usuario, senha]);
      return res.status(200).json({ mensagem: 'Usuário criado com sucesso.' });
    } finally {
      connection.release();
    }
  });
  // READ - Obter todos os usuários
app.get('/usuario', async (req, res) => {
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.query('SELECT * FROM USUARIO');
      return res.status(200).json(query);
    } finally {
      connection.release();
    }
  });
 
  // READ - Obter um usuário pelo ID
  app.get('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.query('SELECT * FROM USUARIO WHERE id = ?', [id]);
      if (query.length === 0) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      return res.status(200).json(query);
    } finally {
      connection.release();
    }
  });
 
  // UPDATE - Atualizar um usuário
  app.put('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_usuario, email_usuario, senha } = req.body;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('UPDATE USUARIO SET nome_usuario = ?, email_usuario = ?, senha = ? WHERE id = ?', [nome_usuario, email_usuario, senha, id]);
      return res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' });
    } finally {
      connection.release();
    }
  });
 
  // DELETE - Excluir um usuário
  app.delete('/usuario/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
      const [query] = await connection.execute('DELETE FROM USUARIO WHERE id = ?', [id]);
      return res.status(200).json({ mensagem: 'Usuário excluído com sucesso.' });
    } finally {
      connection.release();
    }
  });
  