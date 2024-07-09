const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // Certifique-se de que o arquivo db.js está no mesmo diretório

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rota para listar todas as consultas
app.get('/consultas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Consulta');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar consultas' });
    }
});

// Rota para criar uma nova consulta
app.post('/consultas', async (req, res) => {
    const { codigo_consulta, codigo_paciente, CRM, valor_consulta, forma_pagamento, status, consulta_paga } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Consulta (codigo_consulta, codigo_paciente, CRM, valor_consulta, forma_pagamento, status, consulta_paga) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [codigo_consulta, codigo_paciente, CRM, valor_consulta, forma_pagamento, status, consulta_paga]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar consulta' });
    }
});

// Rota para atualizar uma consulta
app.put('/consultas/:codigo_consulta', async (req, res) => {
    const { codigo_consulta } = req.params;
    const { codigo_paciente, CRM, valor_consulta, forma_pagamento, status, consulta_paga } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Consulta SET codigo_paciente = $1, CRM = $2, valor_consulta = $3, forma_pagamento = $4, status = $5, consulta_paga = $6 WHERE codigo_consulta = $7 RETURNING *',
            [codigo_paciente, CRM, valor_consulta, forma_pagamento, status, consulta_paga, codigo_consulta]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar consulta' });
    }
});

// Rota para deletar uma consulta
app.delete('/consultas/:codigo_consulta', async (req, res) => {
    const { codigo_consulta } = req.params;
    try {
        await pool.query('DELETE FROM Consulta WHERE codigo_consulta = $1', [codigo_consulta]);
        res.json({ message: 'Consulta deletada com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao deletar consulta' });
    }
});

// Rota para listar horários disponíveis
app.get('/horarios-disponiveis', async (req, res) => {
    // const { start_time, end_time } = req.query;
    try {
        const result = await pool.query('SELECT horario_fim AS horario FROM Horarios_medico WHERE horario_livre = TRUE');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar horários disponíveis' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
