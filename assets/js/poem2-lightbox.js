// Simple lightbox for poem visuals
(function(){
  const images = [
    '../assets/img/poem2-1.jpg',
    '../assets/img/poem2-2.jpg',
    '../assets/img/poem2-3.jpg',
    '../assets/img/poem2-4.jpg'
  ];

  let current = 0;

  function showLightbox(idx) {
    current = idx;
    let lb = document.createElement('div');
    lb.className = 'poem-lightbox';
    lb.innerHTML = `
      <div class="poem-lightbox-backdrop"></div>
      <div class="poem-lightbox-content">
        <button class="poem-lightbox-close">×</button>
        <button class="poem-lightbox-prev">&#8592;</button>
        <img src="${images[idx]}" alt="Poem Visual" style="max-height:80vh;max-width:90vw;border-radius:12px;transform:rotate(0deg);" />
        <button class="poem-lightbox-next">&#8594;</button>
      </div>
    `;
    document.body.appendChild(lb);
    lb.querySelector('.poem-lightbox-close').onclick = () => lb.remove();
    lb.querySelector('.poem-lightbox-backdrop').onclick = () => lb.remove();
    lb.querySelector('.poem-lightbox-prev').onclick = () => {
      lb.remove();
      showLightbox((current-1+images.length)%images.length);
    };
    lb.querySelector('.poem-lightbox-next').onclick = () => {
      lb.remove();
      showLightbox((current+1)%images.length);
    };
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.postcard-photo-block img').forEach((img, idx) => {
      img.style.transform = 'rotate(0deg)'; // Ensure vertical
      img.onclick = (e) => {
        e.preventDefault();
        showLightbox(idx);
      };
    });
  });
})();

// Lightbox styles
const style = document.createElement('style');
style.innerHTML = `
.poem-lightbox { position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;display:flex;align-items:center;justify-content:center; }
.poem-lightbox-backdrop { position:absolute;top:0;left:0;width:100vw;height:100vh;background:rgba(18,17,22,0.88); }
.poem-lightbox-content { position:relative;z-index:2;display:flex;align-items:center;gap:18px; }
.poem-lightbox-close { position:absolute;top:-32px;right:0;font-size:2rem;background:none;border:none;color:#b79ad6;cursor:pointer; }
.poem-lightbox-prev, .poem-lightbox-next { font-size:2rem;background:none;border:none;color:#b79ad6;cursor:pointer; }
`;
document.head.appendChild(style);
