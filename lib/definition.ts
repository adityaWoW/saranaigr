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
