class LazyLoad {
  constructor({ root, rootMargin, threshold }) {
    this.root = root;
    this.options = {
      rootMargin,
      threshold
    };

    this.handleIntersection = this.handleIntersection.bind(this);
  }

  fetchImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = resolve;
      image.onerror = reject;
    });
  }

  setImage(image) {
    const { src } = image.dataset;
    this.fetchImage(src).then(() => {
      const tag = image.tagName.toLowerCase();
      switch (tag) {
        case 'img':
          image.src = src;
          break;
        case 'div':
        case 'figure':
          image.style.backgroundImage = `url('${src}')`;
          break;
        default:
      }
      image.style.opacity = 1;
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0) {
        this.setImage(entry.target);
      }
    });
  }

  render() {
    if (!this.root.length > 0) {
      return;
    }

    // Exits early if IntersectionObserver is unsupported
    if (!('IntersectionObserver' in window)) {
      Array.from(this.root).forEach(image => this.setImage(image));
      return;
    }

    const observer = new IntersectionObserver(
      this.handleIntersection,
      this.options
    );
    this.root.forEach(image => observer.observe(image));
  }
}

export default LazyLoad;
