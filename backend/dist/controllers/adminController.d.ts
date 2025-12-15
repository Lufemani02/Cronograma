import { Request, Response } from 'express';
export declare const obtenerDepartamentos: (req: Request, res: Response) => Promise<void>;
export declare const crearDepartamento: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const crearMiembro: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const crearLider: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const asignarMiembroADepartamento: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const obtenerMiembrosPorDepartamento: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const obtenerTareasPorDepartamento: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const crearTarea: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=adminController.d.ts.map