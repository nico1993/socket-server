import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente:Socket) => {
    const usuario = new Usuario(cliente.id);
    usuariosConectados.agregar(usuario);    
}

export const desconectar = (cliente:Socket) => {
    cliente.on('disconnect', () => {
        usuariosConectados.borrarUsuario(cliente.id);
    });
};

//Escuchar mensajes
export const mensaje = (cliente:Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (data: {de:string, mensaje:string}) => {
        console.log('Mensaje recibido', data);
        io.emit('mensaje-nuevo', data);
    });
}

//Escuchar login de usuarios
export const loginUsuario = (cliente:Socket) => {
    cliente.on('login-usuario', (data: {nombre: string}, callback: Function) => {
        usuariosConectados.actualizarNombre(cliente.id, data.nombre);
        callback({
            ok: true,
            mensaje: `Usuario ${data.nombre} logueado`
        });
    });
}