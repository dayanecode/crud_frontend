import React, { useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify"
import styled from "styled-components";

const FormContainer = styled.form`
    display: flex;
    align-items: flex-end;
    gap: 10px;
    flex-wrap: wrap;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 0px 5px #ccc;
    border-radius: 5px;
`;

const InputArea = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label``;

const Input = styled.input`
    width: 120px
    padding: 0 10px; 
    border: 1px solid #bbb;
    border-radius: 5px;
    height: 40px
`;

const Button = styled.button`
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background-color: #2c73d2;
    color: white;
    height: 42px;
`;

const Form = ({ getUsers, onEdit, setOnEdit }) => {
    const ref = useRef();

    // Verifica se eu cliquei em algum item do formulário que eu estou recebendo para editar
    useEffect(() => {
        if (onEdit) {
            const user = ref.current;

            user.nome.value = onEdit.nome;
            user.email.value = onEdit.email;
            user.data_nascimento.value = onEdit.data_nascimento;
        }
    }, [onEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = ref.current;

        if (
            !user.nome.value ||
            !user.email.value ||
            !user.data_nascimento.value
        ) {
            return toast.warn("Preencha todos os campos!");
        }

        if (onEdit) {
            await axios
                .put("http://localhost:1028/" + onEdit.id, {
                    nome: user.nome.value,
                    email: user.email.value,
                    data_nascimento: user.data_nascimento.value,
                })
                .then(({ data }) => toast.success(data))
                .catch(({ data }) => toast.error(data))
        } else {
            await axios 
            .post("http://localhost:1028/", {
                nome: user.nome.value,
                email: user.email.value,
                data_nascimento: user.data_nascimento.value,
            })
            .then(({ data }) => toast.success(data))
            .catch(({ data }) => toast.error(data))
        }

        //limpar o formulário após inclusão ou edição 
        user.nome.value = "";
        user.email.value = "";
        user.data_nascimento.value = "";  

        setOnEdit(null); //permite fazer uma inclusão depois da edição sem dar conflitos
        getUsers(); //atualiza o nosso Grid
    }

    return (
        <FormContainer ref={ref} onSubmit={handleSubmit}>
            {/* <InputArea>
                <Label>ID</Label>
                <Input name="id" />
            </InputArea> */}
            <InputArea>
                <Label>Nome</Label>
                <Input name="nome" />
            </InputArea>
            <InputArea>
                <Label>E-mail</Label>
                <Input name="email" type="email" />
            </InputArea>
            <InputArea>
                <Label>Data Nascimento</Label>
                <Input name="data_nascimento" type="date" />
            </InputArea>

            <Button type="submit">SALVAR</Button>
        </FormContainer>

    );
}

export default Form;