// Renders a link that opens a WhatsApp chat with the academy's number.
// This only opens a normal chat - it does NOT start a group audio call.
export default function WhatsAppButton({ number, message, floating = false, className = '' }) {
  const academyNumber = number || import.meta.env.VITE_ACADEMY_WHATSAPP_NUMBER;
  const text = encodeURIComponent(message || 'Assalamu alaikum, I would like to know more about the Quran Academy.');
  const href = `https://wa.me/${academyNumber}?text=${text}`;

  if (floating) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="WhatsApp">
        💬
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${className}`}>
      WhatsApp
    </a>
  );
}
