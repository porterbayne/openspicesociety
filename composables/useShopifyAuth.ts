// composables/useShopifyAuth.ts
export const useShopifyAuth = () => {
  const config = useRuntimeConfig()
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  interface ShopifyCustomer {
    id: string
    firstName: string
    lastName: string
    email: string
  }

  interface ShopifyError {
    message: string
  }

  const customerState = ref<ShopifyCustomer | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get customer data from Shopify using token
  const fetchShopifyCustomer = async (accessToken: string): Promise<ShopifyCustomer> => {
    const query = `
      query {
        customer(customerAccessToken: "${accessToken}") {
          id
          firstName
          lastName
          email
        }
      }
    `

    const response = await fetch(`https://${config.public.shopifyStoreDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': config.public.shopifyStorefrontToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    })

    const result = await response.json()
    if (result.errors) {
      const error = result.errors[0] as ShopifyError
      throw new Error(error.message)
    }
    return result.data.customer
  }

  // Start Shopify login flow
  const login = async () => {
    loading.value = true

    try {
      // Create anonymous Supabase session if needed
      if (!user.value) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: `${Math.random().toString(36).substring(7)}@temp.com`,
          password: Math.random().toString(36)
        })
        if (signUpError) throw signUpError
      }

      // Generate state for CSRF protection
      const state = Math.random().toString(36).substring(7)
      localStorage.setItem('oauth_state', state)

      // Build OAuth URL
      const redirectUri = `${window.location.origin}/auth/callback`
      const authUrl = new URL(`https://${config.public.shopifyStoreDomain}/oauth/authorize`)
      authUrl.searchParams.append('client_id', config.public.shopifyClientId)
      authUrl.searchParams.append('redirect_uri', redirectUri)
      authUrl.searchParams.append('response_type', 'token')
      authUrl.searchParams.append('scope', 'read_customer')
      authUrl.searchParams.append('state', state)

      // Redirect to Shopify
      window.location.href = authUrl.toString()

    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Handle OAuth callback
  const handleCallback = async () => {
    try {
      loading.value = true

      // Get tokens from URL
      const hash = new URLSearchParams(window.location.hash.substring(1))
      const shopifyToken = hash.get('access_token')
      const state = hash.get('state')

      // Verify state
      const storedState = localStorage.getItem('oauth_state')
      localStorage.removeItem('oauth_state')
      if (state !== storedState) throw new Error('Invalid state parameter')
      if (!shopifyToken) throw new Error('No access token received')

      // Get customer data from Shopify
      const shopifyCustomer = await fetchShopifyCustomer(shopifyToken)

      // Store in Supabase
      const { error: upsertError } = await supabase
        .from('shopify_customers')
        .upsert({
          id: user.value.id,
          shopify_customer_id: shopifyCustomer.id,
          access_token: shopifyToken,
          email: shopifyCustomer.email,
          first_name: shopifyCustomer.firstName,
          last_name: shopifyCustomer.lastName
        })

      if (upsertError) throw upsertError

      customerState.value = shopifyCustomer
      return shopifyCustomer

    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Check if user is already logged in
  const initAuth = async () => {
    if (!user.value) return null

    try {
      loading.value = true

      // Get stored Shopify data
      const { data: shopifyData, error: fetchError } = await supabase
        .from('shopify_customers')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (fetchError) throw fetchError

      // Verify token still valid
      const shopifyCustomer = await fetchShopifyCustomer(shopifyData.access_token)
      customerState.value = shopifyCustomer
      return shopifyCustomer

    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Initialize on mount
  onMounted(() => {
    initAuth()
  })

  return {
    customer: readonly(customerState),
    loading: readonly(loading),
    error: readonly(error),
    login,
    handleCallback,
    initAuth
  }
}