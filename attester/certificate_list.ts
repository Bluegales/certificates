export interface Certificate {
    id: number,
    name: string;
    description: string;
}

export enum CertificatesID {
    Dummy,
    Student
}

export const certificates:  {[key in CertificatesID]: Certificate} = {
    [CertificatesID.Dummy]: {
        id: 0,
        name: "Dummy Certificate",
        description: "We can't find you in our database but this certificate will attest that you visited our website :)"
    },
    [CertificatesID.Student]: {
        id: 1,
        name: "Student",
        description: "Certificate that you are currently a student",
    }
};
