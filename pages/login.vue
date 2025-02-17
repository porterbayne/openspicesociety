<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8">Welcome to Open Spice Society</h1>
    <div class="max-w-md mx-auto">
      <PrimeCard>
        <template #title>
          LOGIN to the Community
        </template>
        <template #content>
          <p class="mb-4">Connect with fellow spice enthusiasts and share your culinary adventures.</p>
          <PrimeButton label="Sign In with Shopify" icon="pi pi-shopping-cart" class="w-full" />
          <Button label="Verify" />
        </template>
      </PrimeCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page component logic will be added here
</script>
