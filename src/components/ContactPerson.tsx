import { typeClass } from "@/lib/typographyStyles";

export interface ContactPersonProps {
    name: string;
    title: string;
    email: string;
    phone?: string;
}

export default function ContactPerson({
    name,
    title,
    email,
    phone,
}: ContactPersonProps) {
    return (
        <div className="[&_p]:m-0 [&_a]:m-0">
            <p className={`text-black ${typeClass("contact.personName")}`}>
                {name}
            </p>
            <p className={`text-[#353535] ${typeClass("contact.personTitle")}`}>
                {title}
            </p>
            <a
                href={`mailto:${email}`}
                className={`block text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors ${typeClass("contact.personLink")}`}
            >
                {email}
            </a>
            {phone ? (
                <a
                    href={`tel:${phone.replace(/\s|\(|\)|-/g, "")}`}
                    className={`block text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors ${typeClass("contact.personLink")}`}
                >
                    {phone}
                </a>
            ) : null}
        </div>
    );
}
