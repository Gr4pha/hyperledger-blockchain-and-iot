/**
 * Utils.ts
 * 
 * Content utility enumerations, functions, and basic objects.
 */



 /**
  * Convert an enumeration to an array.
  * Useful for parameter validation.
  */
 export function enum_to_array(e){
     return Object.keys(e).map(k => e[k]);
 }

/**
 * Return the name of the identity which is stored in the certificate.
 * 
 * Typically, 'id_x509' is 'this.tx.stub.getClientIdentity().getID()'.
 * 
 * Example:
 * IN → "x509::/C=US/ST=California/L=San Francisco/CN=Admin@lu.business.com::/C=US/ST=California/L=San Francisco/O=lu.business.com/CN=ca.lu.business.com"
 * OUT → Admin@lu.business.com
 * 
 * @param id_x509 Identity store in X509 certificate
 * @returns name
 */
export function extract_name_from_id(id_x509: string) {
    return id_x509.split("::")[1].split("/CN=")[1];
}

/**
 * Return the organization name of the identity which is stored in the certificate.
 * 
 * Typically, 'id_x509' is 'this.tx.stub.getClientIdentity().getID()'.
 * 
 * Example:
 * IN → "x509::/C=US/ST=California/L=San Francisco/CN=Admin@lu.business.com::/C=US/ST=California/L=San Francisco/O=lu.business.com/CN=ca.lu.business.com"
 * OUT →
 *      [fullnamespace] lu.business.com,
 *      [!fullnamespace] lu
 * 
 * @param id_x509 Identity store in X509 certificate
 * @returns name
 */
export function extract_org_name_from_id(id_x509: string, fullnamespace: boolean=false) {
    if(fullnamespace){
        return id_x509.split("::")[2].split("/O=")[1].split("/CN=")[0];
    } else {
        return id_x509.split("::")[2].split("/O=")[1].split(".")[0];
    }
}

