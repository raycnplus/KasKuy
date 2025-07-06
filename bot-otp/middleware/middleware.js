import express from 'express';
import cors from 'cors';

const Middleware = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // app.use(cors({
    //     origin: FRONTEND_URL,
    //     methods: ["GET", "POST", "PUT", "DELETE"],
    //     credentials: true,
    // }));
};

export default { Middleware };