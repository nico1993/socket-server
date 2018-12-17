import {Router, Request, Response } from 'express';
import Server from '../classes/server';

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


export default router;