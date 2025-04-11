import { DetalleVentas } from "./DetalleVentas";

export class Ventas {
    VentaId!: number;
    Factura!: string;
    Fecha!: Date;
    Total!: number;
    ClienteId!: number;
    Detalle!: DetalleVentas[];
}
