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
        <div>
            <p
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(1.1rem, 1.25vw, 22px)",
                    fontWeight: 700,
                    color: "#000",
                    lineHeight: 1.15,
                }}
            >
                {name}
            </p>
            <p
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(0.85rem, 0.95vw, 15px)",
                    color: "rgba(0,0,0,0.55)",
                    marginTop: "4px",
                }}
            >
                {title}
            </p>
            <a
                href={`mailto:${email}`}
                className="block mt-[8px] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(1rem, 1.1vw, 18px)",
                }}
            >
                {email}
            </a>
            {phone ? (
                <a
                    href={`tel:${phone.replace(/\s|\(|\)|-/g, "")}`}
                    className="block mt-[4px] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                    style={{
                        fontFamily: "Tenon, sans-serif",
                        fontSize: "clamp(1rem, 1.1vw, 18px)",
                    }}
                >
                    {phone}
                </a>
            ) : null}
        </div>
    );
}
