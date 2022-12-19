import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) =>{
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if(!user) return res.status(404).json({msg: "Usuário não encontrado"});
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "Senha incorreta"});
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    const saldo = user.saldo;
    res.status(200).json({uuid, name, email, role, saldo});
}

export const Me = async (req, res) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Por favor, faça login na sua conta!"});
    }
    const user = await User.findOne({
        attributes:['uuid','name','email','role','saldo'],
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "Usuário não encontrado"});
    res.status(200).json(user);
}

export const logOut = (req, res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "Não foi possível sair"});
        res.status(200).json({msg: "Deslogado com Sucesso"});
    });
}