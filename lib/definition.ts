export interface EncryptedConnection {
  ORA: {
    CONNECTION: {
      ORA_IP: string;
      ORA_PORT: string;
      ORA_SERVICENAME: string;
      ORA_USER: string;
      ORA_PWD: string;
      ORA_KODEIGR: string;
    };
  };
}

export interface DecryptedConnection {
  ORA_IP: string;
  ORA_SERVICENAME: string;
  ORA_USER: string;
  ORA_PWD: string;
  ORA_KODEIGR: string;
}

export type BSTS = {
  no_bsts: string,
  tgl_bsts: string,
  jumlah_bronjong: number,
  jumlah_dolly: number,
}

export type BSTSDR = {
  no_bsts: string,
  tgl_bsts: string,
  jumlah_bronjong_kirim: number,
  jumlah_bronjong_kembali: number,
  jumlah_dolly_kirim: number,
  jumlah_dolly_kembali: number,
  barcode_belum_kembali: string
}

export type Signature = {
  pihak_satu: string,
  pihak_dua: string,
  pihak_tiga: string | null
}