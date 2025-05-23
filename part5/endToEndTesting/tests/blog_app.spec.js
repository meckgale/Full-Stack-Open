const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'New User',
        username: 'newuser',
        password: 'password',
      },
    })
    await request.post('/api/users', {
      data: {
        name: 'Other User',
        username: 'otheruser',
        password: 'password',
      },
    })

    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'newuser', 'password')

      await expect(page.getByText('New User logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'newuser', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('New User logged-in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'newuser', 'password')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'new title', 'new user', 'newuser.com')
        await expect(page.getByText('new title new user')).toBeVisible()
      })

      describe('a blog exist', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'new title', 'new user', 'newuser.com')
        })

        test('blog can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          const likesElement = page.locator('.likes')
          await expect(likesElement).toBeVisible()
          const initialLikes = parseInt(
            (await likesElement.textContent()).match(/\d+/)[0],
            10
          )
          await page.getByRole('button', { name: 'like' }).click()
          await expect(likesElement).toHaveText(
            new RegExp(`^${initialLikes + 1}\\s+like`)
          )
        })

        test('the user who added the blog can delete the blog', async ({
          page,
        }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'remove' }).click()
          page.on('dialog', (dialog) => {
            expect(dialog.type()).toContain('confirm')
            expect(dialog.message).toContain('Remove blog')
            dialog.accept()
          })
          await expect(page.getByText('new title new user')).not.toBeVisible()
        })

        test('only the user who added the blog sees the remove button', async ({
          page,
        }) => {
          await page.getByRole('button', { name: 'logout' }).click()
          await loginWith(page, 'otheruser', 'password')
          await page.getByRole('button', { name: 'view' }).click()
          await expect(
            page.getByRole('button', { name: 'remove' })
          ).not.toBeVisible()
        })
      })
    })
  })
})
