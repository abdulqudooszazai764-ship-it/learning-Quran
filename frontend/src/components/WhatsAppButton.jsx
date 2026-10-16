
export default function WhatsAppButton({
  number,
  message,
  floating = false,
  className = '',
}) {
  const academyNumber =
    (number || import.meta.env.VITE_ACADEMY_WHATSAPP_NUMBER || '93709935345')
      .replace(/\D/g, '');

  const text = encodeURIComponent(
    message ||
      'Assalamu alaikum, I would like to know more about the Quran Academy.'
  );

  const href = `https://wa.me/${academyNumber}?text=${text}`;

  if (floating) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contact the academy on WhatsApp"
      >
        💬
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-whatsapp ${className}`}
    >
      WhatsApp
    </a>
  );
}
