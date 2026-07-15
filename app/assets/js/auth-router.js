/* ============================================================================
 * Salmon Developers — role-routing state machine (the front door)
 * ----------------------------------------------------------------------------
 * Explicit and pure. A Flutter go_router redirect/guard will mirror this:
 *   - sign-UP forks (client vs partner) — routeSignUp()
 *   - sign-IN is unified — routeSignIn() decides purely from the account the
 *     backend returns (role + partner account status). The app never guesses.
 *
 * Paths are relative to the shared/ front-door screens.
 * ==========================================================================*/
(function (root) {
  'use strict';

  var DEST = {
    WELCOME:          { screen: 'welcome',            href: 'g02-welcome.page.html' },
    SIGNIN:           { screen: 'signin',             href: 'g04-signin.page.html' },
    FORK:             { screen: 'fork',               href: 'g03-fork.page.html' },
    RESOLVER:         { screen: 'resolver',           href: 'g05-resolver.page.html' },
    WRONG_DOOR:       { screen: 'wrong-door',         href: 'g06-wrong-door.page.html' },
    NO_ACCOUNT:       { screen: 'no-account',         href: 'g03-fork.page.html' },       // offer sign-up
    CLIENT_HOME:      { screen: 'client-home',        href: '../client/explore-list.page.html' },
    CLIENT_SIGNUP:    { screen: 'client-signup',      href: '../shared/signup.page.html' },
    PARTNER_REGISTER: { screen: 'partner-register',   href: '../partner/p02-register-identity.page.html' },
    PARTNER_DASHBOARD:{ screen: 'partner-dashboard',  href: '../partner/dashboard.page.html' }
  };
  // Partner status screen needs the status persisted first (partner-status.page.html reads it).
  function partnerStatus(status) {
    return { screen: 'partner-status', href: '../partner/partner-status.page.html', status: status,
             apply: function () { try { localStorage.setItem('salmon_partner_status', status); } catch (e) {} } };
  }

  function hasRole(acc, r) { return acc && acc.roles && acc.roles.indexOf(r) > -1; }

  // ---- sign-IN: pure decision from the returned account ----
  function routeSignIn(acc) {
    if (!acc) return { decision: 'no-account', dest: DEST.NO_ACCOUNT };
    if (hasRole(acc, 'client') && hasRole(acc, 'partner')) return { decision: 'both', dest: DEST.RESOLVER };
    if (hasRole(acc, 'partner')) {
      if (acc.partnerStatus === 'approved') return { decision: 'partner-approved', dest: DEST.PARTNER_DASHBOARD };
      return { decision: 'partner-' + acc.partnerStatus, dest: partnerStatus(acc.partnerStatus) };
    }
    if (hasRole(acc, 'client')) return { decision: 'client', dest: DEST.CLIENT_HOME };
    return { decision: 'no-account', dest: DEST.NO_ACCOUNT };
  }

  // ---- sign-UP: fork by chosen path ----
  function routeSignUp(path) {
    return path === 'partner'
      ? { decision: 'signup-partner', dest: DEST.PARTNER_REGISTER }
      : { decision: 'signup-client', dest: DEST.CLIENT_SIGNUP };
  }

  // ---- wrong door: chosen path vs the account already on that identifier ----
  function checkDoor(path, acc) {
    if (!acc) return { ok: true };                        // new identifier — proceed
    if (path === 'partner' && !hasRole(acc, 'partner') && hasRole(acc, 'client')) return { ok: false, has: 'client' };
    if (path === 'client'  && !hasRole(acc, 'client')  && hasRole(acc, 'partner')) return { ok: false, has: 'partner' };
    return { ok: true };
  }

  // ---- G01 bootstrap: valid session -> route by role; else welcome ----
  function bootstrap(session) {
    if (!session) return { decision: 'no-session', dest: DEST.WELCOME };
    return routeSignIn(session);
  }

  // Navigate helper: applies side-effects (e.g. persist partner status) then goes.
  function go(dest) {
    if (dest && dest.apply) dest.apply();
    if (dest && dest.href) window.location.href = dest.href;
  }

  root.AuthRouter = { DEST: DEST, routeSignIn: routeSignIn, routeSignUp: routeSignUp, checkDoor: checkDoor, bootstrap: bootstrap, partnerStatus: partnerStatus, go: go };
})(window);
