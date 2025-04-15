import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Configuracion extends EntidadAuditable {
  logo_claro: string | null
  logo_oscuro: string | null
  logo_marca_agua: string | null
  ruc: string | null
  representante: string | null
  razon_social: string | null
  nombre_comercial: string | null
  nombre_empresa: string | null
  direccion_principal: string | null
  telefono: string | null
  moneda: string | null
  tipo_contribuyente: string | null
  celular1: string | null
  celular2: string | null
  correo_principal: string | null
  correo_secundario: string | null
  sitio_web: string | null
  direccion_secundaria1: string | null
  direccion_secundaria2: string | null
  ciiu: string | null
  porcentaje_iva: number | null
  admite_pago_efectivo: string | null
  admite_pago_tarjeta: string | null
  admite_deposito_bancario: string | null
  url_pago_tarjeta: string | null
  numero_cuenta: string | null
  entidad_financiera: string | null
  propietario_cuenta: string | null
  identificacion_propietario_cuenta: string | null
  numero_contacto: string | null
  whatsapp: string | null
  mensaje_whatsapp: string | null = null
  whatsapp_soluciones_empresas: string | null = null
  mensaje_whatsapp_soluciones_empresas: string | null = null
  facebook: string | null
  instagram: string | null
  twitter: string | null

  constructor() {
    super()
    this.logo_claro = null
    this.logo_oscuro = null
    this.logo_marca_agua = null
    this.ruc = null
    this.representante = null
    this.razon_social = null
    this.nombre_comercial = null
    this.nombre_empresa = null
    this.direccion_principal = null
    this.telefono = null
    this.moneda = null
    this.tipo_contribuyente = null
    this.celular1 = null
    this.celular2 = null
    this.correo_principal = null
    this.correo_secundario = null
    this.sitio_web = null
    this.direccion_secundaria1 = null
    this.direccion_secundaria2 = null
    this.ciiu = null
    this.porcentaje_iva = null
    this.admite_pago_efectivo = null
    this.admite_pago_tarjeta = null
    this.admite_deposito_bancario = null
    this.url_pago_tarjeta = null
    this.numero_cuenta = null
    this.entidad_financiera = null
    this.propietario_cuenta = null
    this.identificacion_propietario_cuenta = null
    this.numero_contacto = null
    this.whatsapp = null
    this.facebook = null
    this.instagram = null
    this.twitter = null
  }
}
