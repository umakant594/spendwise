import {NextFunction,Request,Response} from "express"; import jwt from "jsonwebtoken";
const SECRET=process.env.JWT_SECRET||"spendwise_super_secret_key";
export interface AuthRequest extends Request{user?:{id:number;email:string;role:string}}
export function authenticate(req:AuthRequest,res:Response,next:NextFunction){const h=req.headers.authorization;if(!h?.startsWith("Bearer "))return res.status(401).json({message:"Authentication required"});try{req.user=jwt.verify(h.slice(7),SECRET) as AuthRequest["user"];next()}catch{return res.status(401).json({message:"Invalid or expired token"})}}
