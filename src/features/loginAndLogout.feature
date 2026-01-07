Feature: Login and Logout with G.U. Wallet Extension
  As a user
  I want to login and logout using the G.U. Wallet extension
  So that I can access the JOC Dashboard

  Background: Restore wallet & close gu-wallet welcome page (success test)
    When I close the last opened window
    When I restore G.U.Wallet with mnemonic "door brief riot gym apple candy liar spirit umbrella secret sausage hat" and password "Test@123"

  Scenario: Login/logout (success)
    Given I open JOC Dashboard url
    Then I expect that element "text:Welcome to JOC Dashboard" does exist
    Then I wait on element "testId:connect-button" for 5000ms to exist
    When I click on the element "testId:connect-button"
    When I click on the element "testId:connect-selection-0"
    When I click on the element "role:button,Unlock"

    When I focus on G.U.Wallet window
    Then I wait on element "role:button,Approve" for 5000ms to exist
    When I click on the element "role:button,Approve"

    When I focus on JOC Dashboard window
    Then I wait on element "testId:sign-button" for 5000ms to exist
    When I click on the element "testId:sign-button"

    When I focus on G.U.Wallet window
    Then I expect that element "text:Signature Request" does exist
    When I click on the element "role:button,ok"

    When I focus on JOC Dashboard window
    Then I wait on element "text:Dashboard" for 5000ms to exist

    Then I wait on element "testId:logout" for 5000ms to exist
    When I click on the element "testId:logout"
    Then I expect that element "text:Welcome to JOC Dashboard" does exist
