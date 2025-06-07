const fs = require("fs"); // Use 'fs/promises' for async/await for better practice in modern Node.js
const { faker } = require("@faker-js/faker");
const allCategories = require("./categories");

// interface Category {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   priority: number;
//   image: string;
//   parentId: string | null;
//   isFeatured: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   metadata: {
//     seasonal?: boolean;
//     discountEligible?: boolean;
//     trending?: boolean;
//     newArrival?: boolean;
//   };
// }
const generateCategories = () => {
  // Create parent categories first
  const parentCategories = [
    "Clothing",
    "Electronics",
    "Home & Garden",
    "Beauty",
    "Sports",
    "Toys",
    "Automotive",
    "Food",
  ].map((name, index) => ({
    id: faker.string.uuid(),
    name,
    slug: faker.helpers.slugify(name).toLowerCase(),
    description: faker.commerce.productDescription(),
    priority: index + 1, // Parent categories get higher priority
    image: faker.image.urlLoremFlickr({ category: name.toLowerCase() }),
    parentId: null,
    isFeatured: index < 3, // First 3 are featured
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    metadata: {
      seasonal: faker.datatype.boolean(),
      discountEligible: faker.datatype.boolean(),
      trending: index < 5,
    },
  }));

  // Now create subcategories
  const subCategories = allCategories
    .filter((name) => !parentCategories.some((p) => p.name === name))
    .map((name) => {
      // Find a random parent category (some will remain parent categories)
      const parent = faker.helpers.arrayElement(parentCategories);

      return {
        id: faker.string.uuid(),
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
        description: faker.commerce.productDescription(),
        priority: faker.number.int({ min: 10, max: 100 }), // Subcategories get lower priority
        image: faker.image.urlLoremFlickr({ category: name.toLowerCase() }),
        parentId: faker.datatype.boolean(0.7) ? parent.id : null, // 70% chance of being a subcategory
        isFeatured: faker.datatype.boolean(0.3), // 30% chance of being featured
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
        metadata: {
          seasonal: name.includes("Winter") || name.includes("Summer"),
          discountEligible: faker.datatype.boolean(0.6),
          trending: faker.datatype.boolean(0.2),
          newArrival: faker.datatype.boolean(0.1),
        },
      };
    });

  // Combine and sort by priority
  return [...parentCategories, ...subCategories].sort(
    (a, b) => a.priority - b.priority
  );
};

// Usage:
const productCategoriesWithData = generateCategories();

/**
 * Saves an array of objects to a JSON file.
 *
 * @param {string} filename The name of the JSON file to create (e.g., 'data.json').
 * @param {Array<Object>} data The array of JavaScript objects to save.
 */
async function saveToJsonFile(filename, data) {
  try {
    // Convert the JavaScript array of objects into a JSON string
    // The third argument (2) in JSON.stringify is for pretty-printing (indentation)
    const jsonData = JSON.stringify(data, null, 2);

    // Write the JSON string to the specified file
    // fs.promises.writeFile is the asynchronous version, ideal for non-blocking I/O
    await fs.promises.writeFile(filename, jsonData, "utf8");
    console.log(`Data successfully saved to ${filename}`);
  } catch (error) {
    console.error(`Error writing to file ${filename}:`, error);
  }
}

saveToJsonFile("categories.json", productCategoriesWithData);
