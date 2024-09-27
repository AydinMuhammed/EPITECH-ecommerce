<?php

namespace App\Controller;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class ProductController extends AbstractController
{
    #[Route('/products', name: 'get_products', methods: ['GET'])]
    public function getProducts(EntityManagerInterface $entityManager): JsonResponse
    {
        $products = $entityManager->getRepository(Product::class)->findAll();
        return $this->json($products, 200, [], ['groups' => 'product:read']);
    }

    #[Route('/products/{id}', name: 'get_product', methods: ['GET'])]
    public function getProduct(Product $product): JsonResponse
    {
        return $this->json($product, 200, [], ['groups' => 'product:read']);
    }

    #[Route('/products', name: 'add_product', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function addProduct(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $product = new Product();
        $product->setName($data['name']);
        $product->setDescription($data['description']);
        $product->setImage($data['image']);
        $product->setPrice($data['price']);

        $entityManager->persist($product);
        $entityManager->flush();

        return $this->json($product, 201, [], ['groups' => 'product:read']);
    }

    #[Route('/products/{id}', name: 'update_product', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateProduct(Request $request, Product $product, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['name'])) $product->setName($data['name']);
        if (isset($data['description'])) $product->setDescription($data['description']);
        if (isset($data['image'])) $product->setImage($data['image']);
        if (isset($data['price'])) $product->setPrice($data['price']);

        $entityManager->flush();

        return $this->json($product, 200, [], ['groups' => 'product:read']);
    }

    #[Route('/products/{id}', name: 'delete_product', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function deleteProduct(Product $product, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($product);
        $entityManager->flush();

        return $this->json(null, 204);
    }
}