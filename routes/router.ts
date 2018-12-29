import {Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';

const router = Router();

router.get('/mensajes', (request:Request, response:Response) => {
    response.json({
        ok: true,
        mensaje: 'Todo ok'
    });
});

router.post('/mensajes', (request:Request, response:Response) => {

    const cuerpo = request.body.cuerpo;
    const de = request.body.de; 

    const server = Server.instance;
    server.io.emit('mensaje-nuevo', {de, mensaje: cuerpo});

    response.json({
        ok: true,
        cuerpo,
        de
    });
});

router.post('/mensajes/:id', (request:Request, response:Response) => {

    const cuerpo = request.body.cuerpo;
    const de = request.body.de; 
    const id = request.params.id;

    const server = Server.instance;
    server.io.in(id).emit('mensaje-privado-nuevo', {de, cuerpo});

    response.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

//Servicio para obtener todos los ids de los usuarios
router.get('/usuarios', (request:Request, response:Response) => {
    const server = Server.instance;
    server.io.clients((err: any, clientes:string[]) => {
        if(err)
        {
            return response.json({
                ok: false,
                err
            });
        }
        response.json({
            ok: true,
            clientes
        });
    })
});

//Servicio para obtener todos los usuarios con sus nombres
router.get('/usuarios/detalle', (request:Request, response:Response) => {
    response.json({
        ok: true,
        clientes: usuariosConectados.getLista() 
    });
});


export default router;