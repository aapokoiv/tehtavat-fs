const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper.js')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Aapo Koivula',
        username: 'aapokoiv',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })


  describe('Login', () => {
    test('Login succeeds with the correct username/password ', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
      await loginWith(page, 'aapokoiv', 'salainen')
      await expect(page.getByText('Logged in successfully')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'aapokoiv', 'noooo')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Logged in successfully')).not.toBeVisible()
    })
    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'aapokoiv', 'salainen')
      })

      test('A logged-in user can create a blog', async ({ page }) => {
        await page.getByRole('link', { name: 'new blog' }).click()
        await page.getByLabel('title:').fill('E2E testing')
        await page.getByLabel('author:').fill('aapo')
        await page.getByLabel('url:').fill('localhost')
        await page.getByRole('button', { name: 'create' }).click()

        await expect(page.getByText('E2E testing, -aapo')).toBeVisible()
      })

      describe('A logged-in user can like blogs', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'E2E testing', 'aapo', 'localhost')
        })

        test('a blog can be liked', async ({ page }) => {
          await page.getByRole('link', { name: 'E2E testing, -aapo' }).click()
          await expect(page.getByText('0 Likes')).toBeVisible()
          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText('1 Likes')).toBeVisible()
        })

        test('the creator can delete the blog', async ({ page }) => {
          await page.getByRole('link', { name: 'E2E testing, -aapo' }).click()
          page.on('dialog', dialog => dialog.accept())
          await page.getByRole('button', { name: 'delete' }).click()
        })

        test('another user does not see delete button', async ({ page, request }) => {
          await request.post('/api/users', {
            data: {
              name: 'Not Aapo',
              username: 'onni',
              password: 'salainen'
            }
          })
          await page.getByRole('button', { name: 'logout' }).click()
          await loginWith(page, 'onni', 'salainen')

          await page.getByRole('link', { name: 'E2E testing, -aapo' }).click()
          await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
        })
      })

      describe('When there are multiple blogs with some amount of likes', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'Debugging', 'aapo', 'localhost')
          await createBlog(page, 'Vibin', 'aapo', 'localhost')
          await createBlog(page, 'E2E testing', 'aapo', 'localhost')
          await createBlog(page, 'Refactoring', 'aapo', 'localhost')

          const debuggingBlog = page.locator('.blog').filter({ hasText: 'Debugging' })
          const vibinBlog = page.locator('.blog').filter({ hasText: 'Vibin' })
          const e2eBlog = page.locator('.blog').filter({ hasText: 'E2E testing' })
          const refactoringBlog = page.locator('.blog').filter({ hasText: 'Refactoring' })

          await vibinBlog.getByRole('button', { name: 'show' }).click()
          await vibinBlog.getByRole('button', { name: 'like' }).click()
          await expect(vibinBlog).toContainText('likes 1')
          await vibinBlog.getByRole('button', { name: 'like' }).click()
          await expect(vibinBlog).toContainText('likes 2')
          await vibinBlog.getByRole('button', { name: 'like' }).click()
          await expect(vibinBlog).toContainText('likes 3')

          await e2eBlog.getByRole('button', { name: 'show' }).click()
          await e2eBlog.getByRole('button', { name: 'like' }).click()
          await expect(e2eBlog).toContainText('likes 1')
          await e2eBlog.getByRole('button', { name: 'like' }).click()
          await expect(e2eBlog).toContainText('likes 2')

          await debuggingBlog.getByRole('button', { name: 'show' }).click()
          await debuggingBlog.getByRole('button', { name: 'like' }).click()
          await expect(debuggingBlog).toContainText('likes 1')
        })
        test('Blogs are sorted correctly by amount of likes', async ({ page }) => {
          await expect(page.locator('.blog').nth(0)).toContainText('Vibin')
          await expect(page.locator('.blog').nth(1)).toContainText('E2E testing')
          await expect(page.locator('.blog').nth(2)).toContainText('Debugging')
          await expect(page.locator('.blog').nth(3)).toContainText('Refactoring')
        })
      })
    })
  })
})
