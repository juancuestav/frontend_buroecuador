import { Banco } from './SolicitudCredito'

/**
 * Requisitos que se muestran en "Ver requisitos" del paso Banco. Son
 * etiquetas copiadas tal cual del cliente: no cambian los documentos que se
 * piden en el paso Documentos (esos los define el backend).
 */
export interface RequisitosBanco {
  /** Se enfatiza en ambos bancos */
  pagare: string
  grupos: { titulo: string; items: string[] }[]
}

export const REQUISITOS_BANCOS: Record<Banco, RequisitosBanco> = {
  GUAYAQUIL: {
    pagare: 'Pagare firmado por el cliente (Estar de acuerdo en pagar la comisión)',
    grupos: [
      {
        titulo: 'Clientes Afiliados al IESS',
        items: [
          'Solicitud firmada',
          'Datos de contacto del cliente celular y correo',
          'Cédula de identidad',
          '3 últimos roles de pago',
          'Certificado laboral',
          'Mecanizado del IESS',
          'Planilla de servicios básicos',
          '3 últimos estados de cuenta',
          '2 referencias personales (Nombre, parentesco, dirección, celular)',
          'Documentos adicionales (en caso de ser necesarios)',
        ],
      },
      {
        titulo: 'Clientes Con RUC',
        items: [
          'Solicitud firmada',
          'Cédula de identidad',
          '3 últimas declaraciones de IVA',
          'Ultimo impuesto a la renta',
          'Planilla de servicios básicos',
          '3 últimos estados de cuenta',
          '2 referencias personales (Nombre, parentesco, dirección, celular)',
          'Documentos adicionales (en caso de ser necesarios)',
        ],
      },
    ],
  },
  PICHINCHA: {
    pagare: 'Pagare firmado por el cliente ( Estar de acuerdo en pagar la comisión)',
    grupos: [
      {
        titulo: 'Clientes Afiliados al Iess',
        items: [
          'Cédula de identidad',
          '3 últimos roles de pago',
          'Certificado laboral',
          'Mecanizado del IESS',
          'Planilla de servicios básicos',
          '6 últimos estados de cuenta',
          '2 referencias personales (Nombre, parentesco, dirección, celular)',
          'Ultimo predio (Si lo tuviere)',
          'Ultima matricula (Si lo tuviere)',
          'Documentos adicionales (en caso de ser necesarios)',
        ],
      },
      {
        titulo: 'Clientes Con RUC',
        items: [
          'Cédula de identidad',
          'Certificado de RUC',
          '2 Certificados comerciales',
          '6 últimas declaraciones de IVA',
          'Impuesto a la renta, último período o últimos 2 a 3',
          'Planilla de servicios básicos',
          '6 últimos estados de cuenta',
          '2 referencias personales (Nombre, parentesco, dirección, celular)',
          'Ultimo predio ( Si lo tuviere)',
          'Ultima matricula ( Si lo tuviere)',
          'Documentos adicionales ( en caso de ser necesarios)',
        ],
      },
    ],
  },
}
