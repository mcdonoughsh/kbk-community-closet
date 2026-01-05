# Public Images Directory

This directory contains images that will be publicly accessible on the website.

## Usage

Images placed in this directory can be referenced in your Next.js application using:

```tsx
// Using Next.js Image component (recommended)
import Image from "next/image";
<Image src="/images/your-image.jpg" alt="Description" width={500} height={300} />

// Or using regular img tag
<img src="/images/your-image.jpg" alt="Description" />
```

## Organization

Consider organizing images by purpose:
- `/images/hero/` - Hero images for landing pages
- `/images/events/` - Event photos
- `/images/donations/` - Donation-related images
- `/images/general/` - General purpose images

## Best Practices

- Use optimized image formats (WebP, AVIF when possible)
- Keep file sizes reasonable for web performance
- Use descriptive filenames
- Add alt text when using images in components
