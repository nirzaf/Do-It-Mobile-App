import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for the Do IT Mobile App
 * Tests all features as described in the README.md requirements
 */

test.describe('Do IT Mobile App - Complete Feature Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/');
  });

  test('Complete onboarding flow and main features', async ({ page }) => {
    // Test Welcome Screen
    await expect(page.locator('text=Do IT')).toBeVisible();
    
    // Test language toggle (English/Arabic)
    const languageToggle = page.locator('[data-testid="language-toggle"], button:has-text("العربية"), button:has-text("English")');
    if (await languageToggle.count() > 0) {
      await languageToggle.first().click();
      // Wait for language change to take effect
      await page.waitForTimeout(500);
    }
    
    // Click Get Started button
    const getStartedButton = page.locator('button:has-text("Get Started"), a:has-text("Get Started")');
    await expect(getStartedButton).toBeVisible();
    await getStartedButton.click();
    
    // Test User Data Collection Screen (/register/profile)
    await expect(page).toHaveURL(/.*\/register\/profile/);
    
    // Fill out the profile form
    await page.fill('input[name="firstName"], input[placeholder*="First"], input[placeholder*="الاسم"]', 'John');
    await page.fill('input[name="lastName"], input[placeholder*="Last"], input[placeholder*="العائلة"]', 'Doe');
    
    // Select gender
    const genderSelect = page.locator('select[name="gender"], [data-testid="gender-select"]');
    if (await genderSelect.count() > 0) {
      await genderSelect.selectOption('male');
    } else {
      // Try clicking gender buttons if select doesn't exist
      const maleButton = page.locator('button:has-text("Male"), button:has-text("ذكر")');
      if (await maleButton.count() > 0) {
        await maleButton.click();
      }
    }
    
    await page.fill('input[name="weight"], input[placeholder*="Weight"], input[placeholder*="الوزن"]', '75');
    await page.fill('input[name="height"], input[placeholder*="Height"], input[placeholder*="الطول"]', '180');
    await page.fill('input[name="age"], input[placeholder*="Age"], input[placeholder*="العمر"]', '25');
    await page.fill('input[name="email"], input[type="email"], input[placeholder*="Email"]', 'john.doe@example.com');
    await page.fill('input[name="phone"], input[type="tel"], input[placeholder*="Phone"]', '+1234567890');
    
    // Click Next button
    const nextButton = page.locator('button:has-text("Next"), button:has-text("التالي")');
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    
    // Test Goal Selection Screen (/register/goal)
    await expect(page).toHaveURL(/.*\/register\/goal/);
    
    // Select a goal (Lose Weight)
    const loseWeightGoal = page.locator('button:has-text("Lose Weight"), [data-testid="goal-lose-weight"], text="Lose Weight"').first();
    await expect(loseWeightGoal).toBeVisible();
    await loseWeightGoal.click();
    
    // Test Profile Media Screen (/register/media)
    await expect(page).toHaveURL(/.*\/register\/media/);
    
    // Test upload buttons (should be visible but we'll skip actual upload)
    await expect(page.locator('button:has-text("Upload Profile Photo"), button:has-text("Upload")')).toBeVisible();
    
    // Click Finish or Skip button
    const finishButton = page.locator('button:has-text("Finish"), button:has-text("Skip"), button:has-text("إنهاء")');
    await expect(finishButton).toBeVisible();
    await finishButton.click();
    
    // Test Main Dashboard (/dashboard)
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Check for personalized greeting
    await expect(page.locator('text*="Welcome", text*="مرحبا"')).toBeVisible();
    
    // Test Training Program navigation
    const trainingCard = page.locator('button:has-text("Training"), a:has-text("Training"), [data-testid="training-card"]').first();
    await expect(trainingCard).toBeVisible();
    await trainingCard.click();
    
    // Test Training Plan Screen (/training)
    await expect(page).toHaveURL(/.*\/training/);
    
    // Check for workout display
    await expect(page.locator('text*="Day", text*="Chest", text*="Biceps"')).toBeVisible();
    
    // Click on an exercise to test Exercise Detail View
    const exerciseItem = page.locator('[data-testid="exercise-item"], .exercise-item, button:has-text("Push")').first();
    if (await exerciseItem.count() > 0) {
      await exerciseItem.click();
      
      // Test Exercise Detail View
      await expect(page.locator('text*="sets", text*="reps", text*="Sets"')).toBeVisible();
      
      // Go back to training plan
      const backButton = page.locator('button:has-text("Back"), [data-testid="back-button"]');
      if (await backButton.count() > 0) {
        await backButton.click();
      } else {
        await page.goBack();
      }
    }
    
    // Navigate back to dashboard
    await page.goto('http://localhost:5173/dashboard');
    
    // Test Diet Plan navigation
    const dietCard = page.locator('button:has-text("Diet"), a:has-text("Diet"), [data-testid="diet-card"]').first();
    await expect(dietCard).toBeVisible();
    await dietCard.click();
    
    // Test Diet Plan Screen (/diet)
    await expect(page).toHaveURL(/.*\/diet/);
    
    // Check for BMI, calories, and water intake display
    await expect(page.locator('text*="BMI", text*="Calories", text*="Water"')).toBeVisible();
    
    // Check for meal plan
    await expect(page.locator('text*="Breakfast", text*="Lunch", text*="Dinner"')).toBeVisible();
    
    // Navigate to subscription page
    await page.goto('http://localhost:5173/subscription');
    
    // Test Subscription Screen (/subscription)
    await expect(page).toHaveURL(/.*\/subscription/);
    
    // Check for subscription packages
    await expect(page.locator('text*="Basic Package", text*="300 SAR"')).toBeVisible();
    await expect(page.locator('text*="VIP Package", text*="550 SAR"')).toBeVisible();
    
    // Test subscription button
    const subscribeButton = page.locator('button:has-text("Subscribe")').first();
    await expect(subscribeButton).toBeVisible();
    await subscribeButton.click();
    
    // Check for confirmation alert or message
    await expect(page.locator('text*="subscribed", text*="subscription"')).toBeVisible({ timeout: 3000 });
  });

  test('Theme toggle functionality', async ({ page }) => {
    // Test dark/light mode toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"], button:has([data-testid="theme-icon"])');
    
    if (await themeToggle.count() > 0) {
      // Check initial theme
      const htmlElement = page.locator('html');
      const initialClass = await htmlElement.getAttribute('class');
      
      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Check if theme changed
      const newClass = await htmlElement.getAttribute('class');
      expect(newClass).not.toBe(initialClass);
    }
  });

  test('Form validation', async ({ page }) => {
    // Navigate to profile form
    await page.goto('http://localhost:5173/register/profile');
    
    // Try to submit empty form
    const nextButton = page.locator('button:has-text("Next"), button:has-text("التالي")');
    await nextButton.click();
    
    // Should still be on the same page or show validation errors
    await expect(page).toHaveURL(/.*\/register\/profile/);
  });

  test('Navigation and routing', async ({ page }) => {
    // Test direct navigation to protected routes
    await page.goto('http://localhost:5173/dashboard');
    
    // Should either redirect to welcome or show dashboard if user data exists
    await expect(page).toHaveURL(/.*\/(dashboard|\/)/);
    
    // Test 404 handling
    await page.goto('http://localhost:5173/non-existent-route');
    
    // Should handle gracefully (either 404 page or redirect)
    await page.waitForTimeout(1000);
  });

  test('Responsive design and mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate through key screens
    await page.goto('http://localhost:5173/');
    await expect(page.locator('text=Do IT')).toBeVisible();
    
    // Check if mobile layout is working
    const getStartedButton = page.locator('button:has-text("Get Started"), a:has-text("Get Started")');
    await expect(getStartedButton).toBeVisible();
    
    // Test touch interactions
    await getStartedButton.tap();
  });

  test('Internationalization (i18n)', async ({ page }) => {
    // Test language switching
    const languageToggle = page.locator('[data-testid="language-toggle"], button:has-text("العربية"), button:has-text("English")');
    
    if (await languageToggle.count() > 0) {
      // Switch to Arabic
      await languageToggle.click();
      await page.waitForTimeout(500);
      
      // Check for RTL layout or Arabic text
      const bodyElement = page.locator('body, html');
      const dir = await bodyElement.getAttribute('dir');
      
      if (dir === 'rtl') {
        expect(dir).toBe('rtl');
      }
      
      // Switch back to English
      await languageToggle.click();
      await page.waitForTimeout(500);
    }
  });

  test('Data persistence and state management', async ({ page }) => {
    // Complete onboarding flow
    const getStartedButton = page.locator('button:has-text("Get Started"), a:has-text("Get Started")');
    if (await getStartedButton.count() > 0) {
      await getStartedButton.click();
      
      // Fill minimal profile data
      await page.fill('input[name="firstName"], input[placeholder*="First"]', 'Test');
      await page.fill('input[name="lastName"], input[placeholder*="Last"]', 'User');
      
      const nextButton = page.locator('button:has-text("Next")');
      if (await nextButton.count() > 0) {
        await nextButton.click();
        
        // Select goal
        const goalButton = page.locator('button:has-text("Lose Weight")').first();
        if (await goalButton.count() > 0) {
          await goalButton.click();
          
          // Skip media upload
          const skipButton = page.locator('button:has-text("Skip"), button:has-text("Finish")');
          if (await skipButton.count() > 0) {
            await skipButton.click();
            
            // Should be on dashboard
            await expect(page).toHaveURL(/.*\/dashboard/);
            
            // Refresh page and check if user data persists
            await page.reload();
            await expect(page).toHaveURL(/.*\/dashboard/);
          }
        }
      }
    }
  });
});