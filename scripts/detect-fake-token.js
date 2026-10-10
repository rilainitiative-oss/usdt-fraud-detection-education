const fs = require('fs');
const path = require('path');

function detectRedFlagsFromSource(source) {
  const flags = [];

  const checks = [
    {
      name: 'Unrestricted minting',
      pattern: /function\s+mint\s*\([^)]*\)\s*public\s*\{/i,
      trigger: (text) => !/onlyOwner|require\s*\(\s*msg\.sender\s*==\s*owner/i.test(text),
      severity: 'critical'
    },
    {
      name: 'Hidden fee transfer',
      pattern: /fee\s*=\s*\([^)]*\)|hiddenAdmin/i,
      severity: 'high'
    },
    {
      name: 'Blacklist / freeze logic',
      pattern: /blacklist|blacklisted|freezeAccount|addToBlacklist/i,
      severity: 'high'
    },
    {
      name: 'No max supply limit',
      pattern: /totalSupply/i,
      trigger: (text) => !/MAX_SUPPLY|maxSupply/i.test(text),
      severity: 'high'
    },
    {
      name: 'Owner can drain funds',
      pattern: /drain\s*\(|transfer\s*\(address\(this\)\.balance\)/i,
      severity: 'critical'
    },
    {
      name: 'Name/symbol impersonation',
      pattern: /string\s+public\s+name\s*=\s*"Tether USD"|string\s+public\s+symbol\s*=\s*"USDT"/i,
      severity: 'medium'
    }
  ];

  for (const check of checks) {
    const match = source.match(check.pattern);
    if (match) {
      if (!check.trigger || check.trigger(source)) {
        flags.push({
          name: check.name,
          severity: check.severity,
          reason: `Matched suspicious pattern: ${match[0].slice(0, 80)}`
        });
      }
    }
  }

  return flags;
}

function main() {
  const contractsDir = path.join(__dirname, '..', 'contracts');

  for (const file of ['RealToken.sol', 'FakeToken.sol']) {
    const source = fs.readFileSync(path.join(contractsDir, file), 'utf8');
    const flags = detectRedFlagsFromSource(source);

    console.log(`\n=== ${file} ===`);
    if (flags.length === 0) {
      console.log('No obvious suspicious patterns detected.');
    } else {
      for (const flag of flags) {
        console.log(`${flag.severity.toUpperCase()}: ${flag.name}`);
        console.log(`  ${flag.reason}`);
      }
    }
  }
}

main();
