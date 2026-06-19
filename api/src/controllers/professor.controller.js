const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
    const data = req.body;

    const item = await prisma.professor.create({
        data
    });

    res.status(201).json(item);
};

const listar = async (req, res) => {
    const lista = await prisma.professor.findMany();

    res.status(200).json(lista);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.professor.findUnique({
        where: { id: Number(id) }, include:{turmas:true}
    });

    res.status(200).json(item);
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;

    const item = await prisma.professor.update({
        where: { id: Number(id) },
        data: dados
    });

    res.status(200).json(item);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.professor.delete({
        where: { id: Number(id) }
    });

    res.status(200).json(item);
};

const login = async (req, res) => {

    try {

        const { email, senha } = req.body;

        const professor = await prisma.professor.findUnique({
            where: { email }
        });

        if (!professor || professor.senha !== senha) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos"
            });
        }

        return res.status(200).json({
            id: professor.id,
            email: professor.email
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao realizar login"
        });
    }
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir,
    login
};

